import { collection, addDoc } from "firebase/firestore";
import { db } from "./firestoreConfig";

export const assignUserToTask = async (userId, taskId, projectId) => {
    const docRef = await addDoc(collection(db, "UserAssignedTasks"), {
        userId: `/Users/${userId}`,
        taskId: `/Tasks/${taskId}`,
        projectId: `/Projects/${projectId}`,
    });
    return docRef.id;
};
