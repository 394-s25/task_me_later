import { getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "./firestoreConfig";

export const getUserById = async (userId) => {
  const docSnap = await getDoc(doc(db, "users", userId));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const createUser = async (user) => {
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    email: user.email,
  });
};
