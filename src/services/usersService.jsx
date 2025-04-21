import { getDoc, doc, setDoc, getDocs, collection } from "firebase/firestore";
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

export const getAllUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
