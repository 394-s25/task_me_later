import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { Chip } from "@mui/material";
import tml_logo_white from "../imgs/tml_logo_white.png";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProjectCardModal({
  project,
  open,
  onClose,
  setProject,
}) {
  if (!project) return null;

  // Calculate progress percentage
  const calculateProgress = () => {
    const tasksCompleted = project.tasks_completed || 0;
    const tasksTotal = project.tasks_total || 0;

    if (tasksTotal === 0) return 0;
    return Math.round((tasksCompleted / tasksTotal) * 100);
  };

  // Determine status based on progress
  const determineStatus = () => {
    const progress = calculateProgress();
    if (progress === 100) return "Completed";
    if (progress === 0) return "Not Started";
    return "In Progress";
  };

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative", backgroundColor: "#4a7bfe" }}>
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
            <img
              src={tml_logo_white}
              className="align-center w-[80%] mr-10"
              alt="TaskMeLater Logo"
            />
          </Toolbar>
        </AppBar>

        <div className="text-center mt-2 mb-3">
          <h1 className="text-[40px] font-bold">{project.project_name}</h1>
        </div>

        <div className="w-[90%] mx-auto">
          {/* Project Status Box */}
          <div className="relative border-1 rounded-lg p-5 items-center mx-auto mb-4 border-gray-200 bg-[#8db1fd] text-white italic text-[20px]">
            <h2>Due: {project.due_date}</h2>
            <h2>Status: {determineStatus()}</h2>
            <h2>Progress: {calculateProgress()}%</h2>
          </div>

          <Divider className="mt-3" />

          {/* Project Details */}
          <h1 className="font-bold text-xl">Details</h1>
          <p className="mt-2">
            {project.details || "This is where the project details go."}
          </p>

          <Divider className="mt-3" />

          {/* Team & Contribution */}
          <h1 className="font-bold text-xl">Team & Contribution</h1>
          <ul className="list-disc pl-6 mt-2">
            {project.team_contributions ? (
              project.team_contributions.map((member, index) => (
                <li key={index}>
                  {member.name}: {member.contribution}%
                </li>
              ))
            ) : (
              <>
                <li>Name 1: 80%</li>
                <li>Name 2: 20%</li>
                <li>Name 3: 0%</li>
                <li>Name 4: 0%</li>
              </>
            )}
          </ul>

          <Divider className="mt-3" />

          {/* My Tasks */}
          <h1 className="font-bold text-xl">My Tasks</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {project.my_tasks && project.my_tasks.length > 0 ? (
              project.my_tasks.map((task, index) => (
                <Chip
                  key={index}
                  label={task.name}
                  size="medium"
                  sx={{
                    backgroundColor:
                      task.status === "In Progress" ? "orange" : "green",
                    color: "white",
                    fontSize: "14px",
                    padding: "20px 10px",
                  }}
                />
              ))
            ) : (
              <p className="text-gray-500 italic">
                No tasks assigned to you for this project
              </p>
            )}
          </div>

          {/* Team Member Tasks */}
          {project.team_tasks && project.team_tasks.length > 0 ? (
            project.team_tasks.map((memberTasks, index) => (
              <div key={index} className="w-full mt-3">
                <h1 className="font-bold text-xl">
                  {memberTasks.name}'s Tasks
                </h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  {memberTasks.tasks.map((task, taskIndex) => (
                    <Chip
                      key={taskIndex}
                      label={task.name}
                      size="medium"
                      sx={{
                        backgroundColor:
                          task.status === "In Progress" ? "orange" : "green",
                        color: "white",
                        fontSize: "14px",
                        padding: "20px 10px",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="mt-3">
              <p className="text-gray-500 italic">
                No team member tasks available
              </p>
            </div>
          )}

          <Divider className="mt-3" />

          {/* Sign Up For Tasks */}
          <h1 className="font-bold text-xl mt-3">Sign Up For Tasks</h1>
          {project.available_tasks && project.available_tasks.length > 0 ? (
            project.available_tasks.map((task, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg p-4 mt-2 relative"
              >
                <div className="absolute top-2 left-2 flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-1"></div>
                  <span className="text-xs font-semibold text-blue-500">
                    {project.project_name}
                  </span>
                </div>

                <div className="mt-6 pl-2">
                  <h3 className="font-bold">{task.task_title}</h3>
                  <p className="text-xs">Due: {task.due_date}</p>
                  <p className="text-xs">Details: {task.task_details}</p>
                  <p className="text-xs">Task Score: {task.task_score}/100</p>
                  <p className="text-xs">Task Match: {task.task_match}%</p>

                  <div className="flex justify-end mt-2">
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: "#4caf50",
                        fontSize: "12px",
                        ":hover": {
                          backgroundColor: "#388e3c",
                        },
                      }}
                    >
                      Add Task
                    </Button>
                  </div>
                </div>
                <IconButton
                  size="small"
                  className="absolute top-1 right-1"
                  sx={{ padding: 0 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add handler for closing/removing this task card if needed
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
            ))
          ) : (
            <p className="mt-2 text-gray-500 italic">
              No tasks currently available for signup
            </p>
          )}

          <Divider className="mt-3" />

          {/* Notes */}
          <h1 className="font-bold text-xl mt-3">Notes</h1>
          <div className="mt-2">
            {project.notes && project.notes.length > 0 ? (
              project.notes.map((noteGroup, index) => (
                <div key={index} className={index > 0 ? "mt-3" : ""}>
                  <h2 className="font-bold">
                    {noteGroup.user === "Me"
                      ? "My Notes"
                      : `${noteGroup.user}'s Notes`}
                  </h2>
                  <ul className="list-disc pl-6">
                    {noteGroup.notes.map((note, noteIndex) => (
                      <li key={noteIndex}>{note}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">
                No notes available for this project
              </p>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
}
