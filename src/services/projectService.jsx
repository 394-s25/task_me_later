import { doc, getDoc, getDocs, setDoc, collection } from "firebase/firestore";
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

export const postNewProject = async ({
  projId,
  projName,
  projDetails,
  projDueDate,
}) => {
  const projRef = doc(db, "projects", projId.toString());
  await setDoc(projRef, {
    project_id: projId,
    project_name: projName,
    details: projDetails,
    due_date: projDueDate,
    tasks_completed: 0,
    tasks_total: 0,
    team_contributions: [],
    my_tasks: [],
    team_tasks: [],
    available_tasks: [],
    notes: [
      {
        user: "Me",
        notes: ["Working on setting up database."],
      },
      {
        user: "Taylor",
        notes: [
          "I have three color scheme options for the page design, need help deciding.",
          "Presentation is done!",
        ],
      },
    ],
  });
};

export const getAllProjects = async () => {
  const snapshot = await getDocs(collection(db, "projects"));
  return snapshot.docs.map((doc) => ({
    project_id: doc.id,
    ...doc.data(),
  }));
};
