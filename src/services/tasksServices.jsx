import { db } from "./firestoreConfig";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const getUsersTasks = (callback) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.warn("No auth user found");
      callback([]);
      return () => {};
    }

    const q = query(
      collection(db, "tasks"),
      where("help_req", "==", false),
      where("assigned_to", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const tasks = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const taskData = docSnap.data();
            const projectRef = taskData.parent_project;

            let projectName = "Unknown Project";

            if (projectRef) {
              const projectSnap = await getDoc(projectRef);
              if (projectSnap.exists()) {
                const projectData = projectSnap.data();
                projectName = projectData.project_name;
              }
            }

            return {
              id: docSnap.id,
              ...taskData,
              project_name: projectName,
            };
          })
        );
        callback(tasks);
      },
      (error) => {
        console.error("Error in users tasks listener:", error);
        callback([]);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up users tasks listener:", error);
    callback([]);
    return () => {};
  }
};

export const getSignupTasks = (callback) => {
  try {
    const q = query(collection(db, "tasks"), where("help_req", "==", true));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const tasks = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const taskData = docSnap.data();
            const projectRef = taskData.parent_project;

            let projectName = "Unknown Project";

            if (projectRef) {
              const projectSnap = await getDoc(projectRef);
              if (projectSnap.exists()) {
                const projectData = projectSnap.data();
                projectName = projectData.project_name;
              }
            }

            return {
              id: docSnap.id,
              ...taskData,
              project_name: projectName,
            };
          })
        );
        callback(tasks);
      },
      (error) => {
        console.error("Error in signup tasks listener:", error);
        callback([]);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up signup tasks listener:", error);
    callback([]);
    return () => {};
  }
};

export const signUpForTask = async (taskId) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      help_req: false,
      assigned_to: user?.uid || null,
    });
  } catch (error) {
    console.error("Error signing up for task:", error);
    throw error;
  }
};

export const addTaskToProject = async (projectId, taskData) => {
  const parentRef = doc(db, "projects", String(projectId));
  const newTask = {
    task_title: taskData.task_title,
    due_date: taskData.due_date,
    task_status: "To Do",
    task_details: taskData.task_details || "",
    task_score: 0,
    task_match: 0,
    task_notes: [],
    help_req: false,
    project_dependencies: [],
    parent_project: parentRef,
  };
  const docRef = await addDoc(collection(db, "tasks"), newTask);
  return docRef.id;
};

export const updateTaskStatus = async (taskId, newStatus) => {
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, { task_status: newStatus });
};

export const requestHelpForTask = async (taskId) => {
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, { help_req: true });
};
