import { db } from "./firestoreConfig";
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

