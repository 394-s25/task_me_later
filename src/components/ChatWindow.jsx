import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  listenToMessages,
  sendMessage,
  deleteConversation,
} from "../services/messagesService";
import { getAuth } from "firebase/auth";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ChatWindow() {
  const { conversationId } = useParams();
  const location = useLocation();
  const chatPartnerName = location.state?.displayName || "Unknown";
  const currentUser = getAuth().currentUser;
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!conversationId) return;
    const unsubscribe = listenToMessages(conversationId, (msgs) => {
      console.log("Realtime messages:", msgs);
      setMessages(msgs);
      scrollToBottom();
    });
    return unsubscribe;
  }, [conversationId]);

  const handleSend = async () => {
    if (!messageText.trim()) return;
    await sendMessage(conversationId, messageText, currentUser.uid);
    setMessageText("");
  };

  return (
    <Box sx={{ p: 3, maxWidth: "700px", mx: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={() => navigate("/messages")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" gutterBottom>
          Chat with: {chatPartnerName}
        </Typography>
      </Box>
      <Tooltip title="Delete Conversation">
        <IconButton
          color="error"
          onClick={async () => {
            const confirm = window.confirm(
              "Are you sure you want to delete this conversation?"
            );
            if (confirm) {
              await deleteConversation(conversationId);
              navigate("/messages");
            }
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Paper sx={{ p: 2, mb: 2, height: 400, overflowY: "auto" }}>
        <List>
          {messages.map((msg) => {
            const isMe = msg.sender === currentUser?.uid;
            return (
              <ListItem
                key={msg.id}
                sx={{
                  justifyContent: isMe ? "flex-end" : "flex-start",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: isMe ? "#DCF8C6" : "#E1E1E1",
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    maxWidth: "70%",
                    wordBreak: "break-word",
                  }}
                >
                  <Typography variant="body1">{msg.content}</Typography>

                  {msg.timestamp &&
                    (() => {
                      const messageDate = msg.timestamp.toDate();
                      const now = new Date();
                      const isToday =
                        messageDate.getDate() === now.getDate() &&
                        messageDate.getMonth() === now.getMonth() &&
                        messageDate.getFullYear() === now.getFullYear();
                      const formatted = isToday
                        ? messageDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : messageDate.toLocaleTimeString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          });
                      return (
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            textAlign: "right",
                            mt: 0.5,
                            color: "#555",
                            fontSize: "0.7rem",
                          }}
                        >
                          {formatted}
                        </Typography>
                      );
                    })()}
                </Box>
              </ListItem>
            );
          })}
          <div ref={messagesEndRef} />
        </List>
      </Paper>

      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          fullWidth
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Type a message..."
        />
        <Button variant="contained" onClick={handleSend}>
          Send
        </Button>
      </Box>
    </Box>
  );
}
