import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firestoreConfig";
import { getProjectById } from "./projectService";

/**
 * Get tasks assigned to a user
 */
export const getTasksForUser = async (userId) => {
  const userTasksRef = collection(db, "UserAssignedTasks");
  const q = query(userTasksRef, where("userId", "==", `/Users/${userId}`));
  const snapshot = await getDocs(q);

  const tasks = [];
  for (const docSnap of snapshot.docs) {
    const { taskId, projectId } = docSnap.data();
    const taskDoc = await getDoc(doc(db, "Tasks", taskId.split("/")[2]));
    const projectDoc = await getProjectById(projectId.split("/")[2]);

    if (taskDoc.exists()) {
      tasks.push({
        id: taskDoc.id,
        ...taskDoc.data(),
        projectName: projectDoc?.pname || "",
      });
    }
  }

  return tasks;
};

/**
 * Get tasks assigned to a user within a specific project
 */
export const getTasksForUserSpecificProject = async (userId, projectId) => {
  const allUserTasks = await getTasksForUser(userId);
  return allUserTasks.filter(
    (task) => task.projectId === `/Projects/${projectId}`
  );
};

/**
 * Get open tasks (unassigned or help requested) for projects the user is in
 */
export const getOpenTasks = async (userId) => {
  const projectsSnap = await getDocs(
    query(
      collection(db, "Projects"),
      where("members", "array-contains", `/Users/${userId}`)
    )
  );

  const projectIds = projectsSnap.docs.map((d) => d.ref.path);

  const openTasks = [];

  for (const projectId of projectIds) {
    const tasksSnap = await getDocs(
      query(collection(db, "Tasks"), where("projectId", "==", projectId))
    );

    for (const task of tasksSnap.docs) {
      const taskData = task.data();

      const isUnassigned = (
        await getDocs(
          query(
            collection(db, "UserAssignedTasks"),
            where("taskId", "==", task.ref.path)
          )
        )
      ).empty;

      if (isUnassigned || taskData.help_req) {
        openTasks.push({
          id: task.id,
          ...taskData,
          projectName:
            (await getProjectById(projectId.split("/")[2]))?.pname || "",
        });
      }
    }
  }

  return openTasks;
};

/**
 * Get full task details for one task
 */
export const getTaskDetails = async (taskId) => {
  const taskDoc = await getDoc(doc(db, "Tasks", taskId));
  if (!taskDoc.exists()) return null;

  const data = taskDoc.data();
  const projectDoc = await getProjectById(data.projectId.split("/")[2]);

  return {
    id: taskDoc.id,
    ...data,
    projectName: projectDoc?.pname || "",
  };
};

export const getAllTasks = async () => {
  try {
    const snapshot = await getDocs(collection(db, "tasks"));
    const tasks = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        let projectName = null;
        if (data.parent_project) {
          const projectSnap = await getDoc(data.parent_project);
          projectName = projectSnap.exists()
            ? projectSnap.data().project_name
            : "";
        }
        return {
          id: doc.id,
          ...data,
          projectName,
        };
      })
    );
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};
