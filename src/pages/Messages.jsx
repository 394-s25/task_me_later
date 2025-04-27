import React from "react";
import NavBar from "../components/NavBar";
import ConversationList from "../components/ConversationList";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddCommentIcon from "@mui/icons-material/AddComment";
import TaskMeLaterBlueLogo from "../components/TaskMeLaterBlueLogo";
const Messages = () => {
  const navigate = useNavigate();

  return (
    <>
      <TaskMeLaterBlueLogo />
      <Box sx={{ mt: 10 }}>
        <ConversationList />
      </Box>
      <NavBar />
    </>
  );
};

export default Messages;
