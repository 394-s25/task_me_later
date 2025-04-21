import React from "react";
import NavBar from "../components/NavBar";
import ConversationList from "../components/ConversationList";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddCommentIcon from "@mui/icons-material/AddComment";

const Messages = () => {
  const navigate = useNavigate();

  return (
    <>
      <Box sx={{ p: 3, pb: 7 }}>
        {" "}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5">Messages</Typography>
          <Button
            startIcon={<AddCommentIcon />}
            variant="contained"
            onClick={() => navigate("/new-conversation")}
          >
            New Conversation
          </Button>
        </Box>
        <ConversationList />
      </Box>

      <NavBar />
    </>
  );
};

export default Messages;
