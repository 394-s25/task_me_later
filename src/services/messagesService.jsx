import { db } from "./firestoreConfig";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const getConversationId = (uid1, uid2) => {
  return [uid1, uid2].sort().join("_");
};

export const getOrCreateConversation = async (uid1, uid2) => {
  const conversationId = getConversationId(uid1, uid2);
  const convoRef = doc(db, "conversations", conversationId);
  try {
    const convoSnap = await getDoc(convoRef);
    if (!convoSnap.exists()) {
      await setDoc(convoRef, {
        members: [uid1, uid2],
        lastMessage: "",
        lastUpdated: serverTimestamp(),
      });
    }
  } catch (err) {}
  await setDoc(convoRef, {
    members: [uid1, uid2],
    lastMessage: "",
    lastUpdated: serverTimestamp(),
  });
  return conversationId;
};

export const sendMessage = async (conversationId, messageText, senderUid) => {
  const messagesRef = collection(
    db,
    "conversations",
    conversationId,
    "messages"
  );

  await addDoc(messagesRef, {
    sender: senderUid,
    content: messageText,
    timestamp: serverTimestamp(),
  });

  await updateDoc(doc(db, "conversations", conversationId), {
    lastMessage: messageText,
    lastUpdated: serverTimestamp(),
  });
};

export const listenToMessages = (conversationId, callback) => {
  const q = query(
    collection(db, "conversations", conversationId, "messages"),
    orderBy("timestamp")
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  });
};

export const getUserConversations = async (uid) => {
  const q = query(collection(db, "conversations"));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((conv) => conv.members.includes(uid));
};

export const fetchDisplayNames = async (conversations, currentUid) => {
  const nameCache = {};
  const updatedConversations = await Promise.all(
    conversations.map(async (conv) => {
      const otherUid = conv.members.find((uid) => uid !== currentUid);
      if (!nameCache[otherUid]) {
        const userSnap = await getDoc(doc(db, "users", otherUid));
        nameCache[otherUid] = userSnap.exists()
          ? userSnap.data().display_name || otherUid
          : otherUid;
      }
      return {
        ...conv,
        displayName: nameCache[otherUid],
      };
    })
  );
  return updatedConversations;
};

export const deleteConversation = async (conversationId) => {
  const convoRef = doc(db, "conversations", conversationId);
  const messagesRef = collection(
    db,
    "conversations",
    conversationId,
    "messages"
  );
  const messagesSnapshot = await getDocs(messagesRef);
  const deletePromises = messagesSnapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
  await deleteDoc(convoRef);
};
