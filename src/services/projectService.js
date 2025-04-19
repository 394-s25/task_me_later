import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "./firestoreConfig";

export const getProjectById = async (projectId) => {
  const docRef = doc(db, "Projects", projectId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const getAllProjectNames = async () => {
  try {
    const snapshot = await getDocs(collection(db, "projects"));

    return snapshot.docs.map((doc) => ({
      name: doc.data().project_name,
    }));
  } catch (error) {
    console.error("Error fetching project names:", error);
    return [];
  }
};
