import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firestoreConfig";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getOrCreateConversation } from "../services/messagesService";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Card,
  Box,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function NewConversation() {
  const [availableUsers, setAvailableUsers] = useState([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersAndFilter = async () => {
      const [allUsersSnap, allConvosSnap] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(collection(db, "conversations")),
      ]);

      const allUsers = allUsersSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const allConversations = allConvosSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const existingConversationPartners = new Set();

      allConversations.forEach((conv) => {
        if (conv.members.includes(currentUser.uid)) {
          conv.members.forEach((member) => {
            if (member !== currentUser.uid) {
              existingConversationPartners.add(member);
            }
          });
        }
      });

      const filteredUsers = allUsers.filter(
        (user) =>
          user.id !== currentUser.uid &&
          !existingConversationPartners.has(user.id)
      );

      setAvailableUsers(filteredUsers);
    };

    fetchUsersAndFilter();
  }, [currentUser]);

  const handleStartConversation = async (otherUser) => {
    const conversationId = await getOrCreateConversation(
      currentUser.uid,
      otherUser.id
    );

    navigate(`/chat/${conversationId}`, {
      state: { displayName: otherUser.display_name || otherUser.id },
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={() => navigate("/messages")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ ml: 1 }}>
          Start a New Conversation
        </Typography>
      </Box>
      <List>
        {availableUsers.map((user) => (
          <Card
            key={user.id}
            sx={{ mb: 2, p: 1, cursor: "pointer" }}
            onClick={() => handleStartConversation(user)}
          >
            <ListItem>
              <ListItemText
                primary={user.display_name || user.id}
                secondary={user.email}
              />
            </ListItem>
          </Card>
        ))}
        {availableUsers.length === 0 && (
          <Typography variant="body2" sx={{ mt: 2, color: "gray" }}>
            No users available to start a new conversation with.
          </Typography>
        )}
      </List>
    </Box>
  );
}
