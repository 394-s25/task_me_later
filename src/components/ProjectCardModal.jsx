import * as React from "react";
import { useState, useEffect } from "react";
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
import ProjectSignUpCard from "./ProjectSignUpCard";
import AddTaskForm from "./AddTaskForm";

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

  const [availableTasks, setAvailableTasks] = useState([]);
  const [signedUpTasks, setSignedUpTasks] = useState([]);

  // Use an effect to update availableTasks when project changes
  useEffect(() => {
    if (project && project.available_tasks) {
      setAvailableTasks([...project.available_tasks]);
    } else {
      setAvailableTasks([]);
    }
  }, [project]);

  const handleTaskClick = (task) => {
    console.log("Task clicked:", task);
  };

  const handleSignUp = (task) => {
    // Add the task to signedUpTasks
    setSignedUpTasks([...signedUpTasks, task]);

    // Remove the task from availableTasks by filtering out the task with the same task_title
    setAvailableTasks(
      availableTasks.filter((t) => t.task_title !== task.task_title)
    );

    console.log(`Signed up for task: ${task.task_title}`);
  };

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

  // Get background color based on task status
  const getTaskStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "orange";
      case "To Do":
        return "red";
      case "Completed":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
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
                    backgroundColor: getTaskStatusColor(task.status),
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
                        backgroundColor: getTaskStatusColor(task.status),
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
          <div className="flex justify-start items-center gap-4 mt-3 mb-2">
            <h1 className="font-bold text-xl">Sign Up For Tasks</h1>
            <AddTaskForm
              projectId={project.project_id}
              onTaskAdded={(task) =>
                setAvailableTasks((prev) => [...prev, task])
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {availableTasks && availableTasks.length > 0 ? (
              availableTasks.map((task, index) => (
                <ProjectSignUpCard
                  key={index}
                  task={{
                    ...task,
                    project: project.project_name,
                    needsHelp: Math.random() > 0, // Random for demo purposes
                  }}
                  onClick={handleTaskClick}
                  onSignUp={handleSignUp}
                />
              ))
            ) : (
              <p className="mt-2 text-gray-500 italic col-span-2">
                No tasks currently available for signup
              </p>
            )}
          </div>

          {/* Signed Up Tasks Section */}
          {/* {signedUpTasks.length > 0 && (
            <>
              <Divider className="mt-3" />
              <h1 className="font-bold text-xl mt-3">Your Signed Up Tasks</h1>
              <ul className="bg-white rounded-lg shadow-md p-4 mt-2">
                {signedUpTasks.map((task, index) => (
                  <li key={index} className="py-2 border-b last:border-0">
                    <span className="font-medium">{task.task_title}</span> -
                    Due: {task.due_date}
                  </li>
                ))}
              </ul>
            </>
          )} */}

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
