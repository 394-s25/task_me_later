import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import tml_logo_white from "../imgs/tml_logo_white.png";
import {
  Chip,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  updateTaskStatus,
  requestHelpForTask,
  deleteTask,
} from "../services/tasksServices";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TaskCardModal({
  task,
  open,
  onClose,
  setTask,
  allTasks,
  onTaskDeleted,
}) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  if (!task) return null;

  const getRandomHexColor = () =>
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");

  const markAsCompleted = async () => {
    try {
      await updateTaskStatus(task.id, "Completed");
      setTask((prev) => ({ ...prev, task_status: "Completed" }));
      onClose();
    } catch (err) {
      console.error("Failed to mark task as complete: ", err);
    }
  };

  const requestHelp = async () => {
    try {
      await requestHelpForTask(task.id);
      setTask((prev) => ({ ...prev, help_req: true }));
      onClose();
    } catch (err) {
      console.error("Failed to request help for task: ", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      setConfirmOpen(false);
      if (onTaskDeleted) onTaskDeleted(task.id);
      onClose();
    } catch (err) {
      console.error("Failed to delete task: ", err);
    }
  };

  const isCompleted = task.task_status === "Completed";

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
            <b>{task.project_name || "Unknown project"}</b>
          </h2>
        </div>
        <div class="w-[90%] mx-auto">
          <div class="relative border-1 rounded-lg p-5 items-center mx-auto mb-4 border-gray-200 bg-[#8db1fd] text-white italic text-[20px]">
            <h2>
              Assigned To:{" "}
              {task.assigned_to
                ? task.assigned_name || task.assigned_to
                : "Unassigned"}
            </h2>
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
                      const nextTask = allTasks.find(
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

          {!isCompleted && (
            <div className="flex flex-row justify-center items-center gap-4 mt-5">
              <Button
                className="bg-amber-500 text-white rounded-lg text-[15px] px-1 py-0.5 w-[125px]"
                onClick={requestHelp}
              >
                Ask For Help
              </Button>
              <Button
                className="bg-green-400 text-white rounded-lg text-[15px] px-1 py-0.5 w-[175px]"
                onClick={markAsCompleted}
              >
                Mark As Complete
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setConfirmOpen(true)}
              >
                Delete Task
              </Button>
            </div>
          )}

          {isCompleted && (
            <div className="text-center mt-5 mb-3 p-3 bg-green-100 rounded-lg">
              <p className="text-green-700 font-medium">
                ✓ This task has been completed
              </p>
            </div>
          )}
        </div>
      </Dialog>
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="confirm-delete-title"
      >
        <DialogTitle id="confirm-delete-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
