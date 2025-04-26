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
import { Button, Chip } from "@mui/material";
import tml_logo_white from "../imgs/tml_logo_white.png";
import ProjectSignUpCard from "./ProjectSignUpCard";
import AddTaskForm from "./AddTaskForm";
import { getTasksByProjectId, signUpForTask } from "../services/tasksServices";
import { getAuth } from "firebase/auth";
import TaskCardModal from "./TaskCardModal";
import { markProjectAsComplete } from "../services/projectService";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProjectCardModal({
  project,
  open,
  onClose,
  setProject,
  onProjectUpdated,
}) {
  const [availableTasks, setAvailableTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [otherTasks, setOtherTasks] = useState([]);

  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const user = getAuth().currentUser;

  const loadTasks = async () => {
    const { mine, assigned, available } = await getTasksByProjectId(
      project.project_id,
      user.uid
    );
    setMyTasks(mine);
    setAvailableTasks(available);
    setOtherTasks(assigned);
  };

  useEffect(() => {
    if (!project || !user) return;
    loadTasks();
  }, [project]);

  const handleTaskClick = (task) => {
    setSelectedCard(task);
    setOpenTaskModal(true);
  };

  const handleSignUp = (task) => {
    setMyTasks([...myTasks, task]);
    setAvailableTasks(
      availableTasks.filter((t) => t.task_title !== task.task_title)
    );
    signUpForTask(task.id);
  };

  const handleMarkCompleted = async (project_id) => {
    try {
      await markProjectAsComplete(project_id);
      if (onProjectUpdated) onProjectUpdated();
      onClose();
    } catch (err) {
      console.error("Error marking project as complete: ", err);
    }
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

  if (!project) return null;

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
            {myTasks.length > 0 ? (
              myTasks.map((task, index) => (
                <Chip
                  key={task.id || index}
                  label={task.task_title}
                  size="medium"
                  sx={{
                    backgroundColor: getTaskStatusColor(task.task_status),
                    color: "white",
                    fontSize: "14px",
                    padding: "20px 10px",
                  }}
                  onClick={() => handleTaskClick(task)}
                />
              ))
            ) : (
              <p className="text-gray-500 italic">
                No tasks assigned to you for this project
              </p>
            )}
          </div>

          {/* Team Member Tasks */}
          {otherTasks.length > 0 ? (
            <>
              <h1 className="font-bold text-xl mt-3">
                Tasks Assigned to Other Members
              </h1>
              <div className="flex flex-wrap gap-2 mt-2">
                {otherTasks.map((task, index) => (
                  <Chip
                    key={task.id || index}
                    label={task.task_title}
                    size="medium"
                    sx={{
                      backgroundColor: getTaskStatusColor(task.task_status),
                      color: "white",
                      fontSize: "14px",
                      padding: "20px 10px",
                    }}
                    onClick={() => handleTaskClick(task)}
                  />
                ))}
              </div>
            </>
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
              onTaskAdded={() => loadTasks()}
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
          {!project.completed ? (
            <>
              <Divider className="mt-6 mb-4" />
              <div className="text-center mt-6 mb-6">
                <Button
                  variant="contained"
                  color="primary"
                  disabled={
                    !project || project.tasks_completed < project.tasks_total
                  }
                  onClick={async () => handleMarkCompleted(project.project_id)}
                >
                  Mark Project as Complete
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </Dialog>
      <TaskCardModal
        task={selectedCard}
        open={openTaskModal}
        onClose={() => {
          setOpenTaskModal(false);
          loadTasks();
        }}
        setTask={setSelectedCard}
        allTasks={[...myTasks, ...otherTasks, ...availableTasks]}
        onTaskDeleted={() => loadTasks()}
      />
    </>
  );
}
