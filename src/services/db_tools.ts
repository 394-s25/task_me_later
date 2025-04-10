import { initializeApp } from "firebase/app";

import { Contributor } from "../models/contributor";
import { Project } from "../models/project";
import { Role } from "../models/role";
import { Task } from "../models/task";
import { User } from "../models/user";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  runTransaction,
  TaskState
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDKa1TSzuNER1HuZ6k9FJGh0loeBdwYeic",
  authDomain: "task-me-later.firebaseapp.com",
  projectId: "task-me-later",
  storageBucket: "task-me-later.firebasestorage.app",
  messagingSenderId: "340212522916",
  appId: "1:340212522916:web:60764ab9ce58d1f7dfab31",
  measurementId: "G-Q0HR9MZ34Q"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const addContributor = async (contributor: Contributor, id: string) => {
  await setDoc(doc(db, "contributors", id), {
    ...contributor
  });
}

const addProject = async (project: Project) => {
  const promise = await incrementCollectionId("projects");
  const next_id = promise.valueOf();
  await setDoc(doc(db, "projects", next_id), {
    ...project
  });
};

const addRole = async (role: Role) => {
  const promise = await incrementCollectionId("roles");
  const next_id = promise.valueOf();
  await setDoc(doc(db, "roles", next_id), {
    ...role
  });
}

const addTask = async (task: Task) => {
  const promise = await incrementCollectionId("tasks");
  const next_id = promise.valueOf();
  await setDoc(doc(db, "tasks", next_id), {
    ...task
  });
}

const addUser = async (user: User, id: string) => {
  const promise = await incrementCollectionId("users");
  const next_id = promise.valueOf();
  await setDoc(doc(db, "users", next_id), {
    ...user
  });
}

const incrementCollectionId = async (collectionName: string): Promise<string> => {
  const counterRef = doc(db, "counter", collectionName);
  const nextId = await runTransaction(db, async (transaction) => {
    const counter = await transaction.get(counterRef);
    const current = counter.exists()
      ? counter.data().counter ?? -1
      : -1;
    const next = current + 1;
    transaction.set(counterRef, { counter: next });
    return next;
  });
  return nextId.toString();
};