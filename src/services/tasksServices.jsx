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
  getDocs,
  increment,
  runTransaction,
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
  await updateDoc(parentRef, {
    tasks_total: increment(1),
  });
  return docRef.id;
};

export const updateTaskStatus = async (taskId, newStatus) => {
  const taskRef = doc(db, "tasks", taskId);
  await runTransaction(db, async (transaction) => {
    const taskDoc = await transaction.get(taskRef);
    if (!taskDoc.exists()) throw new Error("Task does not exist");
    const oldStatus = taskDoc.data().task_status;
    const parentRef = taskDoc.data().parent_project;
    transaction.update(taskRef, { task_status: newStatus });
    if (oldStatus !== "Completed" && newStatus === "Completed") {
      transaction.update(parentRef, { tasks_completed: increment(1) });
    } else if (oldStatus === "Completed" && newStatus !== "Completed") {
      transaction.update(parentRef, { tasks_completed: increment(-1) });
    }
  });
};

export const requestHelpForTask = async (taskId) => {
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, { help_req: true });
};

export const getTasksByProjectId = async (projectId, currentUserId) => {
  try {
    const projectRef = doc(db, "projects", String(projectId));
    const q = query(
      collection(db, "tasks"),
      where("parent_project", "==", projectRef)
    );
    const snapshot = await getDocs(q);

    const assigned = [];
    const available = [];
    const mine = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      const task = { id: doc.id, ...data };

      if (data.assigned_to === currentUserId) {
        mine.push(task);
      } else if (data.assigned_to) {
        assigned.push(task);
      } else {
        available.push(task);
      }
    });

    return { mine, assigned, available };
  } catch (err) {
    console.error("Error fetching tasks by project: ", err);
    return { mine: [], assigned: [], available: [] };
  }
};
