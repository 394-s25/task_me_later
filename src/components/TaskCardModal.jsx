import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import taskData2 from "../../mock_data.json";
import tml_logo from "../imgs/tml_logo.png";
import TaskCardModalStatus from "./TaskCardModalStatus";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TaskCardModal({ task, open, onClose }) {
  if (!task) return null;
  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
        sx={{ color: "black" }}
      >
        <AppBar sx={{ position: "relative" }} class="bg-gray-50">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography
              sx={{ ml: 2, flex: 1 }}
              variant="h6"
              component="div"
            ></Typography>
            <img src={tml_logo} class="align-center w-[80%] mr-10"></img>
          </Toolbar>
        </AppBar>
        <div class="text-center mt-2 mb-3">
          <h1 class="text-[50px] font-bold">{task.task_title}</h1>
          <h2 class="text-[23px] mt-[-5px]">
            Project: <b>{task.parent_project}</b>
          </h2>
          <h2 class="mx-4 color-lightgray text-[14px]">
            Project Details: {task.task_details}
          </h2>
        </div>
        <div class="relative border-1 rounded-xl p-2 m-4 border-gray-200 bg-gray-300 drop-shadow-2xl">
          <h2 class="mb-15 text-[20px]">DUE: {task.due_date}</h2>
          <h2 class="absolute top-2 right-3 text-[20px]">
            Task Match: {task.task_score}%
          </h2>
          <h2 class="absolute bottom-2 left-2 text-[20px]">
            User Points: {task.task_score}
          </h2>
          <div class="absolute bottom-1 right-0 w-40 h-10">
            <TaskCardModalStatus />
          </div>
        </div>

        <div class="relative border-1 rounded-xl p-2 m-4 border-gray-500">
          <h1 class="text-center text-[20px]">NOTES:</h1>
          {task.task_notes?.map((notes, index) => (
            <div key={index}>
              <p class="text-gray-600">{notes.user}:</p>
              <ul class="text-gray-600">{notes.details}</ul>
            </div>
          ))}
        </div>
      </Dialog>
    </>
  );
}
