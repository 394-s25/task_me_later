import React, { useEffect, useState } from "react";
import {
  fetchDisplayNames,
  getUserConversations,
} from "../services/messagesService";
import { deleteConversation } from "../services/messagesService";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Box,
  CircularProgress,
  Avatar,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import AddCommentIcon from "@mui/icons-material/AddComment";
import SearchIcon from "@mui/icons-material/Search";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ConversationList() {
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteMode, setDeleteMode] = useState(false); // NEW
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUser) return;
      const convos = await getUserConversations(currentUser.uid);
      const convosWithNames = await fetchDisplayNames(convos, currentUser.uid);
      setConversations(convosWithNames);
      setFilteredConversations(convosWithNames);
      setLoading(false);
    };

    fetchConversations();
  }, [currentUser]);

  const handleConversationClick = (conversationId, displayName) => {
    navigate(`/chat/${conversationId}`, {
      state: { displayName: displayName },
    });
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    const loweredQuery = query.toLowerCase().trim();

    if (!loweredQuery) {
      setFilteredConversations(conversations);
    } else {
      const queryParts = loweredQuery.split(" ");

      setFilteredConversations(
        conversations.filter((conv) => {
          const names = conv.displayName.toLowerCase().split(" ");
          const firstName = names[0] || "";
          const lastName = names[1] || "";

          if (queryParts.length === 1) {
            // Single word search (no space)
            return (
              firstName.startsWith(queryParts[0]) ||
              lastName.startsWith(queryParts[0])
            );
          } else {
            // Multiple words (e.g., "luke huff")
            const firstQuery = queryParts[0];
            const lastQuery = queryParts.slice(1).join(" "); // in case of multiple spaces
            return (
              firstName.startsWith(firstQuery) && lastName.startsWith(lastQuery)
            );
          }
        })
      );
    }
  };

  function truncateAtWord(text, maxLength) {
    if (text.length <= maxLength) return text;
    const truncated = text.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    if (lastSpace === -1) return truncated + "...";
    return truncated.slice(0, lastSpace) + "...";
  }

  const NewConversationButton = () => {
    return (
      <Button
        variant="contained"
        onClick={() => navigate("/new-conversation")}
        sx={{ height: 40, minWidth: "40px", p: 0 }}
      >
        <AddCommentIcon />
      </Button>
    );
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
      {/* Search + Controls */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          alignItems: "center",
          mb: 2,
        }}
      >
        {/* . . . Button */}
        <IconButton
          onClick={() => setDeleteMode(!deleteMode)}
          size="small"
          sx={{
            border: "1px solid",
            borderColor: deleteMode ? "error.main" : "#ccc",
            borderRadius: 1,
            height: 40,
            backgroundColor: deleteMode ? "rgba(255,0,0,0.1)" : "transparent",
            color: deleteMode ? "error.main" : "inherit",
            transition: "all 0.2s",
          }}
        >
          <MoreHorizIcon />
        </IconButton>

        {/* Search Bar */}
        <TextField
          fullWidth
          variant="outlined"
          label="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* New Conversation Button */}
        <NewConversationButton />
      </Box>

      {/* Conversation Cards */}
      {filteredConversations.map((conv) => (
        <Card
          key={conv.id}
          sx={{
            p: 2,
            mb: 2,
            position: "relative",
            cursor: "pointer",
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
          onClick={() => handleConversationClick(conv.id, conv.displayName)}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={conv.photoURL || undefined}
              alt={conv.displayName}
              sx={{ width: 40, height: 40 }}
            >
              {conv.displayName?.[0] || "?"}
            </Avatar>

            <Box sx={{ ml: 2, flexGrow: 1 }}>
              <Typography variant="subtitle1">
                <b>{conv.displayName}</b>
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {conv.lastMessage
                  ? truncateAtWord(conv.lastMessage, 100)
                  : "No Messages"}
              </Typography>
            </Box>

            {/* Show delete button if deleteMode is ON */}

            {deleteMode && (
              <IconButton
                color="error"
                onClick={async (e) => {
                  e.stopPropagation();
                  const confirmDelete = window.confirm(
                    "Are you sure you want to delete this conversation?"
                  );
                  if (confirmDelete) {
                    await deleteConversation(conv.id);

                    // 🔥 After deleting from Firestore, update your local list too:
                    setConversations((prev) =>
                      prev.filter((c) => c.id !== conv.id)
                    );
                    setFilteredConversations((prev) =>
                      prev.filter((c) => c.id !== conv.id)
                    );
                  }
                }}
                size="small"
                sx={{ ml: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        </Card>
      ))}
    </Box>
  );
}
