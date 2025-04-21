import { initializeApp } from "firebase/app";

import { Contributor } from "../src/models/contributor";
import { Project } from "../src/models/project";
import { Role } from "../src/models/role";
import { Task } from "../src/models/task";
import { User } from "../src/models/user";
import { firebaseConfig } from "../src/services/firestoreConfig";

import { getFirestore, doc, setDoc, runTransaction } from "firebase/firestore";

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const addContributor = async (contributor, id) => {
  await setDoc(doc(db, "contributors", id), {
    ...contributor,
  });
};

const addProject = async (project) => {
  const promise = await incrementCollectionId("projects");
  const next_id = promise.valueOf();
  await setDoc(doc(db, "projects", next_id), {
    ...project,
  });
};

const addRole = async (role) => {
  const promise = await incrementCollectionId("roles");
  const next_id = promise.valueOf();
  await setDoc(doc(db, "roles", next_id), {
    ...role,
  });
};

const addTask = async (task) => {
  const promise = await incrementCollectionId("tasks");
  const next_id = promise.valueOf();
  await setDoc(doc(db, "tasks", next_id), {
    ...task,
  });
};

const addUser = async (user, id) => {
  const promise = await incrementCollectionId("users");
  const next_id = promise.valueOf();
  await setDoc(doc(db, "users", next_id), {
    ...user,
  });
};

const incrementCollectionId = async (collectionName) => {
  const counterRef = doc(db, "counter", collectionName);
  const nextId = await runTransaction(db, async (transaction) => {
    const counter = await transaction.get(counterRef);
    const current = counter.exists() ? counter.data().counter ?? -1 : -1;
    const next = current + 1;
    transaction.set(counterRef, { counter: next });
    return next;
  });
  return nextId.toString();
};

module.exports = {
  db,
  addContributor,
  addProject,
  addRole,
  addTask,
  addUser,
};
