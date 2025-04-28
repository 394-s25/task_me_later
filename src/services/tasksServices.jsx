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
  deleteDoc,
  arrayUnion,
  arrayRemove,
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
      where("assigned_to", "array-contains", user.uid)
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

            let assignedName = "Unassigned";
            if (Array.isArray(taskData.assigned_to) && taskData.assigned_to.length > 0) {
              const userPromises = taskData.assigned_to.map(async (userId) => {
                const userRef = doc(db, "users", userId);
                const userSnap = await getDoc(userRef);
                return userSnap.exists() ? userSnap.data().display_name || "Unknown" : "Unknown";
              });
              assignedName = await Promise.all(userPromises);
            }

            return {
              id: docSnap.id,
              ...taskData,
              project_name: projectName,
              assigned_name: assignedName,
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
    const q = query(collection(db, "tasks"), where("help_req", "==", true), where("assigned_to", "==", []));

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
      assigned_to: arrayUnion(user?.uid),
    });
  } catch (error) {
    console.error("Error signing up for task:", error);
    throw error;
  }
};

export const addTaskToProject = async (projectId, taskData) => {
  const parentRef = doc(db, "projects", String(projectId));
  const newTask = {
    assigned_to: taskData.assigned_to || [],
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

export const editTask = async (taskId, taskData) => {
  const updatedTask = {
    task_title: taskData.task_title,
    due_date: taskData.due_date,
    task_details: taskData.task_details || "",
  };
  const docRef = doc(db, "tasks", taskId);
  await updateDoc(docRef, updatedTask);
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

    const taskPromises = snapshot.docs.map(async (taskDoc) => {
      const data = taskDoc.data();
      let assignedName = ["Unassigned"];
      if (Array.isArray(data.assigned_to) && data.assigned_to.length > 0) {
        const userPromises = data.assigned_to.map(async (userId) => {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        return userSnap.exists() ? userSnap.data().display_name : "Unknown";
        });
          assignedName = await Promise.all(userPromises);
        }

      const task = { id: taskDoc.id, assigned_name: assignedName, ...data };

      if (data.assigned_to.includes(currentUserId)) {
        mine.push(task);
      } else if (data.assigned_to.length > 0) {
        assigned.push(task);
      } else {
        available.push(task);
      }
    });

    await Promise.all(taskPromises);

    return { mine, assigned, available };
  } catch (err) {
    console.error("Error fetching tasks by project: ", err);
    return { mine: [], assigned: [], available: [] };
  }
};

export const deleteTask = async (taskId) => {
  const taskRef = doc(db, "tasks", taskId);
  await deleteDoc(taskRef);
};

export const addNoteToTask = async (taskId, note) => {
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, {
    task_notes: arrayUnion(note),
  });
};

export const updateNoteInTask = async (taskId, oldNote, newNote) => {
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, {
    task_notes: arrayRemove(oldNote),
  });
  await updateDoc(taskRef, {
    task_notes: arrayUnion(newNote),
  });
};

export const updateTaskNotes = async (taskId, updatedNotes) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, { task_notes: updatedNotes });
  } catch (err) {
    console.error("Error updating task notes: ", err);
    throw err;
  }
};

export const getUnassignedTasks = (callback) => {
  try {
    const tasksCollection = collection(db, "tasks");

    const unsubscribe = onSnapshot(
      tasksCollection,
      async (snapshot) => {
        const tasks = await Promise.all(
          snapshot.docs
            .filter((docSnap) => {
              const data = docSnap.data();
              return Array.isArray(data.assigned_to) && data.assigned_to.length === 0 && !data.help_req;
            })
            .map(async (docSnap) => {
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
                assigned_name: "Unassigned",
              };
            })
        );

        callback(tasks);
      },
      (error) => {
        console.error("Error in unassigned tasks listener:", error);
        callback([]);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up unassigned tasks listener:", error);
    callback([]);
    return () => {};
  }
};


export const getProjectMembers = async (projectId) => {
  try {
    // Fetch project document to get project_members
    const projectRef = doc(db, "projects", String(projectId));
    const projectSnap = await getDoc(projectRef);
    if (!projectSnap.exists()) {
      console.error("Project not found:", projectId);
      return [];
    }
    const projectMembers = projectSnap.data().project_members || [];

    // If no project members, return empty array
    if (projectMembers.length === 0) {
      return [];
    }

    // Fetch user documents for project_members
    const userPromises = projectMembers.map(async (userId) => {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return { id: userSnap.id, name: userSnap.data().display_name };
      }
      return null;
    });

    const users = await Promise.all(userPromises);
    // Filter out null values (users not found)
    return users.filter((user) => user !== null);
  } catch (error) {
    console.error("Error fetching project members:", error);
    return [];
  }
};

export const getAvailableTasks = (callback) => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    // If no user is logged in, return empty results
    if (!currentUser) {
      console.warn("No current user logged in for getAvailableTasks");
      callback([]);
      return () => {};
    }

    const tasksCollection = collection(db, "tasks");

    // Query 1: Tasks with help_req: true
    const q1 = query(tasksCollection, where("help_req", "==", true));
    // Query 2: Tasks with assigned_to: []
    const q2 = query(tasksCollection, where("assigned_to", "==", []));

    // Store unique tasks to avoid duplicates
    const tasksMap = new Map();

    // Process snapshot for a query
    const processSnapshot = async (snapshot) => {
      const tasksPromises = snapshot.docs
        .filter((docSnap) => {
          const taskData = docSnap.data();
          // Exclude tasks where current user's ID is in assigned_to
          return !taskData.assigned_to.includes(currentUser.uid);
        })
        .map(async (docSnap) => {
          const taskData = docSnap.data();
          const projectRef = taskData.parent_project;

          let projectName = "Unknown Project";
          if (projectRef) {
            const projectSnap = await getDoc(projectRef);
            if (projectSnap.exists()) {
              projectName = projectSnap.data().project_name;
            }
          }

          let assignedName = "Unassigned";
          if (Array.isArray(taskData.assigned_to) && taskData.assigned_to.length > 0) {
            const userPromises = taskData.assigned_to.map(async (userId) => {
              const userRef = doc(db, "users", userId);
              const userSnap = await getDoc(userRef);
              return userSnap.exists() ? userSnap.data().display_name || "Unknown" : "Unknown";
            });
            assignedName = await Promise.all(userPromises);
          }

          return {
            id: docSnap.id,
            ...taskData,
            project_name: projectName,
            assigned_name: assignedName,
          };
        });

      const tasks = await Promise.all(tasksPromises);
      tasks.forEach((task) => tasksMap.set(task.id, task));
    };

    // Subscribe to both queries
    const unsubscribe1 = onSnapshot(
      q1,
      async (snapshot) => {
        await processSnapshot(snapshot);
        callback(Array.from(tasksMap.values()));
      },
      (error) => {
        console.error("Error in available tasks listener (help_req):", error);
        callback([]);
      }
    );

    const unsubscribe2 = onSnapshot(
      q2,
      async (snapshot) => {
        await processSnapshot(snapshot);
        callback(Array.from(tasksMap.values()));
      },
      (error) => {
        console.error("Error in available tasks listener (unassigned):", error);
        callback([]);
      }
    );

    // Return function to unsubscribe from both
    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  } catch (error) {
    console.error("Error setting up available tasks listener:", error);
    callback([]);
    return () => {};
  }
};
