import json
from dataclasses import dataclass, fields, asdict
from firebase_functions import https_fn
from firebase_admin import initialize_app, firestore
import logging


@dataclass
class contributors:
    project_id: str
    user_id: str
    role_id: str


@dataclass
class projects:
    name: str


@dataclass
class users:
    username: str


@dataclass
class tasks:
    project_id: str
    contributor_id: str


@dataclass
class roles:
    role_name: str


initialize_app()


def create_logger():
    logger = logging.getLogger("task_me_later")
    logger.setLevel(logging.INFO)
    if not logger.hasHandlers():
        handler = logging.StreamHandler()
        formatter = logging.Formatter("[%(levelname)s] %(asctime)s - %(message)s")
        handler.setFormatter(formatter)
        logger.addHandler(handler)
    return logger


logger = create_logger()


@firestore.transactional
def upload(transaction, instance, counter_ref, collection_ref):
    collection_name = type(instance).__name__
    counter_doc = counter_ref.document(collection_name)
    snapshot = counter_doc.get(transaction=transaction)
    if snapshot.exists:
        new_id = snapshot.get("counter") + 1
    else:
        new_id = 1
    transaction.set(counter_doc, {"counter": new_id})
    doc_ref = collection_ref.document(str(new_id))
    transaction.set(doc_ref, asdict(instance))
    logger.info(
        f"Uploaded document {new_id} to {collection_name} with fields:\n{asdict(instance)}"
    )
    return new_id


def clear_database():
    db = firestore.client()
    for collection in [
        "projects",
        "tasks",
        "contributors",
        "users",
        "roles",
        "counter",
    ]:
        docs = db.collection(collection).list_documents()
        for doc in docs:
            doc.delete()


def seed_database(data):
    db = firestore.client()
    counter_data = {
        "projects": 0,
        "tasks": 0,
        "contributors": 0,
        "users": 0,
        "roles": 0,
    }

    for proj in data["projects"]:
        db.collection("projects").document(str(proj["proj_id"])).set(proj)
        counter_data["projects"] = max(counter_data["projects"], proj["proj_id"])

    for task in data["tasks"]:
        db.collection("tasks").document(str(task["task_id"])).set(task)
        counter_data["tasks"] = max(counter_data["tasks"], task["task_id"])

    for contrib in data["contributors"]:
        db.collection("contributors").document(str(contrib["contrib_id"])).set(contrib)
        counter_data["contributors"] = max(
            counter_data["contributors"], contrib["contrib_id"]
        )

    for user in data["users"]:
        db.collection("users").document(str(user["user_id"])).set(user)
        counter_data["users"] = max(counter_data["users"], user["user_id"])

    for role in data["roles"]:
        db.collection("roles").document(str(role["role_id"])).set(role)
        counter_data["roles"] = max(counter_data["roles"], role["role_id"])

    for collection_name, max_id in counter_data.items():
        db.collection("counter").document(collection_name).set({"counter": max_id})


def handle_get(req, model_cls):
    model_name = model_cls.__name__.lower()
    db = firestore.client()
    collection_ref = db.collection(model_name)

    if req.method != "GET":
        return "Method not allowed", 405, None

    doc_id = req.args.get("id")
    if not doc_id:
        return "Missing 'id' query parameter", 400, None

    logger.info(f"Fetching {model_name} with ID: {doc_id}")
    doc = collection_ref.document(doc_id).get()
    if not doc.exists:
        return f"{model_cls.__name__} with ID '{doc_id}' not found", 404, None

    return json.dumps(doc.to_dict()), 200, "application/json"


def handle_add(req, model_cls):
    model_name = model_cls.__name__.lower()
    db = firestore.client()
    counter_ref = db.collection("counter")
    collection_ref = db.collection(model_name)

    if req.method != "POST":
        return "Method not allowed", 405, None

    try:
        data = req.get_json()
        logger.info(f"Got data {data} from request")
        if data is None:
            return "Invalid JSON", 400, None

        required = {f.name for f in fields(model_cls)}
        missing = required - data.keys()
        if missing:
            return f"Missing fields: {', '.join(missing)}", 400, None

        instance = model_cls(**data)
        transaction = db.transaction()
        upload(
            transaction,
            instance=instance,
            counter_ref=counter_ref,
            collection_ref=collection_ref,
        )
        return f"{model_cls.__name__} uploaded", 200, None
    except Exception as e:
        return f"Internal Server Error: {str(e)}", 500, None


@https_fn.on_request()
def get_user(req):
    body, status, mime = handle_get(req, users)
    return https_fn.Response(body, status=status, mimetype=mime)


@https_fn.on_request()
def get_project(req):
    body, status, mime = handle_get(req, projects)
    return https_fn.Response(body, status=status, mimetype=mime)


@https_fn.on_request()
def get_role(req):
    body, status, mime = handle_get(req, roles)
    return https_fn.Response(body, status=status, mimetype=mime)


@https_fn.on_request()
def get_task(req):
    body, status, mime = handle_get(req, tasks)
    return https_fn.Response(body, status=status, mimetype=mime)


@https_fn.on_request()
def get_contributor(req):
    body, status, mime = handle_get(req, contributors)
    return https_fn.Response(body, status=status, mimetype=mime)


@https_fn.on_request()
def add_user(req):
    body, status, mime = handle_add(req, users)
    return https_fn.Response(body, status=status, mimetype=mime)


@https_fn.on_request()
def add_project(req):
    body, status, mime = handle_add(req, projects)
    return https_fn.Response(body, status=status, mimetype=mime)


@https_fn.on_request()
def add_role(req):
    body, status, mime = handle_add(req, roles)
    return https_fn.Response(body, status=status, mimetype=mime)


@https_fn.on_request()
def add_task(req):
    body, status, mime = handle_add(req, tasks)
    return https_fn.Response(body, status=status, mimetype=mime)


@https_fn.on_request()
def add_contributor(req):
    body, status, mime = handle_add(req, contributors)
    return https_fn.Response(body, status=status, mimetype=mime)


@https_fn.on_request()
def seed_firestore(req: https_fn.Request) -> https_fn.Response:
    if req.method != "POST":
        return https_fn.Response("Method not allowed", status=405)

    try:
        payload = req.get_json()
        if not payload:
            return https_fn.Response("No data provided", status=400)

        clear_database()
        seed_database(payload)
        return https_fn.Response("Database cleared and seeded successfully", status=200)
    except Exception as e:
        return https_fn.Response(f"Internal Server Error: {str(e)}", status=500)
