import React, { useEffect, useState } from "react";
import {
  fetchDisplayNames,
  getUserConversations,
} from "../services/messagesService";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Box, CircularProgress } from "@mui/material";

export default function ConversationList() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUser) return;
      const convos = await getUserConversations(currentUser.uid);
      const convosWithNames = await fetchDisplayNames(convos, currentUser.uid);
      setConversations(convosWithNames);
      setLoading(false);
    };

    fetchConversations();
  }, [currentUser]);

  const handleConversationClick = (conversationId, displayName) => {
    navigate(`/chat/${conversationId}`, {
      state: { displayName: displayName },
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Conversations
      </Typography>
      {conversations.map((conv) => {
        return (
          <Card
            key={conv.id}
            onClick={() => handleConversationClick(conv.id, conv.displayName)}
            sx={{
              p: 2,
              mb: 2,
              cursor: "pointer",
              "&:hover": { backgroundColor: "#f0f0f0" },
            }}
          >
            <Typography variant="subtitle1">
              Chat with: <b>{conv.displayName}</b>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Last Message: {conv.lastMessage || "No Messages"}
            </Typography>
          </Card>
        );
      })}
    </Box>
  );
}
