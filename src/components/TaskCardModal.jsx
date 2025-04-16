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
import tml_logo_white from "../imgs/tml_logo_white.png";
import TaskCardModalStatus from "./TaskCardModalStatus";
import { Chip } from "@mui/material";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TaskCardModal({ task, open, onClose, setTask }) {
  if (!task) return null;
  const getRandomHexColor = () =>
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
        sx={{ backgroundColor: "#8db1fd" }}
      >
        <AppBar sx={{ position: "relative", backgroundColor: "#77A1F3" }}>
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
            <img src={tml_logo_white} class="align-center w-[80%] mr-10"></img>
          </Toolbar>
        </AppBar>

        <div class="text-center mt-2 mb-3">
          <h1 class="text-[40px] font-bold">{task.task_title}</h1>
          <h2 class="text-[20px] mt-[-5px]">
            <b>{task.parent_project}</b> Project
          </h2>
        </div>
        <div class="w-[90%] mx-auto">
          <div class="relative border-1 rounded-lg p-5 items-center mx-auto mb-4 border-gray-200 bg-[#8db1fd] text-white italic text-[20px]">
            <h2>Due: {task.due_date}</h2>
            <h2>Status: {task.task_status}</h2>
            <h2>Task Score: {task.task_score}/100</h2>
            <h2>Match Percentage: {task.task_match}%</h2>
          </div>
          <hr class="mt-3" />
          {/* <div class="w-[90%] mx-auto"> */}
          <h1 class="font-bold">Details</h1>
          <h1>{task.task_details}</h1>
          {/* </div> */}
          <hr class="mt-3" />
          <div>
            <h1 class="font-bold">Dependencies</h1>
            <div class="flex gap-2 mt-1">
              {task.project_dependencies?.map((proj_dep, index) => (
                <div key={index}>
                  <Chip
                    label={proj_dep}
                    size="small"
                    sx={{
                      backgroundColor: getRandomHexColor(),
                      color: "white",
                    }}
                    onClick={() => {
                      const nextTask = taskData2.tasks.find(
                        (t) => t.task_title === proj_dep
                      );
                      if (nextTask) {
                        setTask(nextTask); // update the modal to show this task
                      } else {
                        console.warn(
                          "Task not found for dependency:",
                          proj_dep
                        );
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <hr class="mt-3" />
          <div>
            <h1 class="font-bold text-[19px]">Notes</h1>
            {task.task_notes?.map((notes, index) => (
              <div key={index}>
                <h1 class="font-bold text-[16px]">{notes.user}</h1>
                <li class="text-[14px]">{notes.details}</li>
              </div>
            ))}
          </div>
          <div class="flex flex-row justify-center items-center gap-4 mt-5">
            <Button class="bg-amber-500 text-white rounded-lg text-[15px] px-1 py-0.5 w-[125px]">
              Ask For Help
            </Button>
            <Button class="bg-green-400 text-white rounded-lg text-[15px] px-1 py-0.5 w-[175px]">
              Mark As Complete
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
