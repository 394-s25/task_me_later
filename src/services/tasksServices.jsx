/*import { db } from "./firestoreConfig";
import { collection, getDocs, getDoc, query, where } from "firebase/firestore";

export const getUsersTasks = async () => {
    try {
        const q = query(collection(db, "tasks"), where("help_req", "==", false));
        const snapshot = await getDocs(q);

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
                //console.log("Project Name:", projectName);
            }
            }

            return {
            id: docSnap.id,
            ...taskData,
            project_name: projectName,
            };
        })
        );

        return tasks;
    } catch (error) {
        console.error("Error fetching user tasks:", error);
        return [];
    }
};


export const getSignupTasks = async () => {
    try {
        const q = query(collection(db, "tasks"), where("help_req", "==", true));
        const snapshot = await getDocs(q);

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

        return tasks;
    } catch (error) {
        console.error("Error fetching signup tasks:", error);
        return [];
    }
};

*/

import { db } from "./firestoreConfig";
import { collection, doc, getDoc, updateDoc, query, where, onSnapshot } from "firebase/firestore";

export const getUsersTasks = (callback) => {
  try {
    console.log("Setting up real-time listener for tasks with help_req == false");
    const q = query(collection(db, "tasks"), where("help_req", "==", false));

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

        console.log("Real-time user tasks:", tasks);
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
    console.log("Setting up real-time listener for tasks with help_req == true");
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

        console.log("Real-time signup tasks:", tasks);
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
    console.log("Updating task:", taskId);
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      help_req: false,
    });
    console.log("Task updated, help_req set to false");
  } catch (error) {
    console.error("Error signing up for task:", error);
    throw error;
  }
};