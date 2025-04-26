import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  collection,
  updateDoc,
  deleteDoc,
  query,
  where,
  increment,
} from "firebase/firestore";
import { db } from "./firestoreConfig";
import { getAuth } from "firebase/auth";

export const getProjectById = async (projectId) => {
  const docRef = doc(db, "projects", projectId);
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
  projMembers,
}) => {
  const projRef = doc(db, "projects", projId.toString());
  await setDoc(projRef, {
    project_id: projId,
    project_name: projName,
    project_members: projMembers,
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
  console.log("Getting all projects from database");
  const auth = getAuth();
  const user = auth.currentUser;

  const snapshot = await getDocs(collection(db, "projects"));

  const projects = snapshot.docs
    .map((doc) => ({
      project_id: doc.id,
      ...doc.data(),
    }))
    .filter((project) => {
      const hiddenFor = project.hidden_for || [];
      return !hiddenFor.includes(user?.uid);
    });

  console.log("Projects returned:", projects);
  return projects;
};

export const markProjectAsComplete = async (projectId) => {
  const projectRef = doc(db, "projects", String(projectId));
  await updateDoc(projectRef, {
    completed: true,
  });
};

export const deleteProjectForMe = async (projectId) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("No authenticated user found");
      return false;
    }

    const projectRef = doc(db, "projects", String(projectId));

    const projectSnap = await getDoc(projectRef);
    if (!projectSnap.exists()) {
      console.error("Project does not exist");
      return false;
    }

    const projectData = projectSnap.data();

    const hiddenFor = projectData.hidden_for || [];
    if (!hiddenFor.includes(user.uid)) {
      hiddenFor.push(user.uid);
    }

    await updateDoc(projectRef, {
      hidden_for: hiddenFor,
    });

    const tasksQuery = query(
      collection(db, "tasks"),
      where("parent_project", "==", projectRef),
      where("assigned_to", "==", user.uid)
    );

    const taskSnapshot = await getDocs(tasksQuery);

    const deletePromises = taskSnapshot.docs.map((taskDoc) =>
      deleteDoc(doc(db, "tasks", taskDoc.id))
    );

    await Promise.all(deletePromises);

    if (taskSnapshot.docs.length > 0) {
      const completedTasks = taskSnapshot.docs.filter(
        (doc) => doc.data().task_status === "Completed"
      ).length;

      await updateDoc(projectRef, {
        tasks_total: increment(-taskSnapshot.docs.length),
        tasks_completed: increment(-completedTasks),
      });
    }

    return true;
  } catch (error) {
    console.error("Error deleting project for me:", error);
    return false;
  }
};

export const deleteProjectForEveryone = async (projectId) => {
  try {
    const projectRef = doc(db, "projects", String(projectId));

    const tasksQuery = query(
      collection(db, "tasks"),
      where("parent_project", "==", projectRef)
    );

    const taskSnapshot = await getDocs(tasksQuery);

    const deleteTaskPromises = taskSnapshot.docs.map((taskDoc) =>
      deleteDoc(doc(db, "tasks", taskDoc.id))
    );

    await Promise.all(deleteTaskPromises);

    await deleteDoc(projectRef);

    return true;
  } catch (error) {
    console.error("Error deleting project for everyone:", error);
    return false;
  }
};

const handleDeleteForEveryone = async () => {
  try {
    console.log("Deleting project for everyone:", project.project_id);
    const success = await deleteProjectForEveryone(project.project_id);
    console.log("Delete success:", success);
    if (success) {
      if (onProjectUpdated) {
        console.log("Calling onProjectUpdated after deletion");
        onProjectUpdated();
      }
      onClose();
    }
    setDeleteDialogOpen(false);
  } catch (error) {
    console.error("Error deleting project for everyone:", error);
    setDeleteDialogOpen(false);
  }
};
