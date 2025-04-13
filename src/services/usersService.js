import { getDoc, doc } from "firebase/firestore";
import { db } from "./firestoreConfig";

export const getUserById = async (userId) => {
  const docSnap = await getDoc(doc(db, "Users", userId));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};
