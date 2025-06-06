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
import {
  Button,
  Chip,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import tml_logo_white from "../imgs/tml_logo_white.png";
import ProjectSignUpCard from "./ProjectSignUpCard";
import AddTaskForm from "./AddTaskForm";
import { getTasksByProjectId, signUpForTask } from "../services/tasksServices";
import { getAuth } from "firebase/auth";
import TaskCardModal from "./TaskCardModal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { db } from "../services/firestoreConfig";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import {
  markProjectAsComplete,
  deleteProjectForMe,
  deleteProjectForEveryone,
} from "../services/projectService";

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

  const [newProjectNoteText, setNewProjectNoteText] = useState("");
  const [editingProjectNoteIndex, setEditingProjectNoteIndex] = useState(-1);
  const [editingProjectNoteText, setEditingProjectNoteText] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  const handleAddProjectNote = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      let displayName = user.displayName;

      if (!displayName) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          displayName = userSnap.data().display_name || "Unknown";
        } else {
          displayName = "Unknown";
        }
      }

      const note = {
        user: displayName,
        userId: user.uid,
        details: newProjectNoteText.trim(),
        timestamp: new Date().toISOString(),
      };

      const updatedNotes = [...(project.notes || []), note];

      await updateDoc(doc(db, "projects", String(project.project_id)), {
        notes: updatedNotes,
      });

      setProject((prev) => ({
        ...prev,
        notes: updatedNotes,
      }));

      setNewProjectNoteText("");
    } catch (err) {
      console.error("Failed to add project note: ", err);
    }
  };

  const handleSaveEditedProjectNote = async (index) => {
    try {
      const updatedNotes = [...(project.notes || [])];
      updatedNotes[index] = {
        ...updatedNotes[index],
        details: editingProjectNoteText.trim(),
      };

      await updateDoc(doc(db, "projects", String(project.project_id)), {
        notes: updatedNotes,
      });

      setProject((prev) => ({
        ...prev,
        notes: updatedNotes,
      }));

      setEditingProjectNoteIndex(-1);
      setEditingProjectNoteText("");
    } catch (err) {
      console.error("Failed to edit project note: ", err);
    }
  };

  const handleDeleteProjectNote = async (index) => {
    try {
      const updatedNotes = [...(project.notes || [])];
      updatedNotes.splice(index, 1);

      await updateDoc(doc(db, "projects", String(project.project_id)), {
        notes: updatedNotes,
      });

      setProject((prev) => ({
        ...prev,
        notes: updatedNotes,
      }));
    } catch (err) {
      console.error("Failed to delete project notes: ", err);
    }
  };

  const handleDeleteForMe = async () => {
    try {
      const success = await deleteProjectForMe(project.project_id);
      if (success) {
        if (onProjectUpdated) onProjectUpdated();
        onClose();
      }
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting project for me:", error);
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteForEveryone = async () => {
    try {
      const success = await deleteProjectForEveryone(project.project_id);
      if (success) {
        if (onProjectUpdated) onProjectUpdated();
        onClose();
      }
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting project for everyone:", error);
      setDeleteDialogOpen(false);
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
        <AppBar
          sx={{
            position: "sticky",
            top: 0,
            backgroundColor: "#77A1F3",
            zIndex: 1100,
          }}
        >
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
          <h1 className="font-bold text-xl mt-3">Notes</h1>
          <div className="mt-2">
            {project.notes && project.notes.length > 0 ? (
              project.notes.map((note, index) => (
                <div key={index} className="mb-2">
                  {editingProjectNoteIndex === index ? (
                    <>
                      <input
                        type="text"
                        value={editingProjectNoteText}
                        onChange={(e) =>
                          setEditingProjectNoteText(e.target.value)
                        }
                        className="border p-1 w-full"
                      />
                      <div className="flex gap-2 mt-1">
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleSaveEditedProjectNote(index)}
                        >
                          Save
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setEditingProjectNoteIndex(-1)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <li className="text-[14px]">{note.details}</li>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex flex-col">
                          <p className="text-gray-500 text-xs">
                            {note.user} -{" "}
                            {new Date(note.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {note.userId === user?.uid && (
                          <div className="flex items-center gap-1">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setEditingProjectNoteIndex(index);
                                setEditingProjectNoteText(note.details);
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteProjectNote(index)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">
                No notes available for this project
              </p>
            )}

            <div className="mt-4">
              <h2 className="font-bold text-[16px]">Add a Note</h2>
              <textarea
                rows="3"
                value={newProjectNoteText}
                onChange={(e) => setNewProjectNoteText(e.target.value)}
                className="border w-full p-2 mt-2"
                placeholder="Write your note here..."
              />
              <Button
                variant="contained"
                className="mt-2"
                onClick={handleAddProjectNote}
                disabled={!newProjectNoteText.trim()}
              >
                Add Note
              </Button>
            </div>
          </div>

          {!project.completed ? (
            <>
              <Divider className="mt-6 mb-4" />
              <div className="flex justify-between mt-6 mb-6">
                {!project.completed ? (
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={
                      !project || project.tasks_completed < project.tasks_total
                    }
                    onClick={async () =>
                      handleMarkCompleted(project.project_id)
                    }
                  >
                    Mark Project as Complete
                  </Button>
                ) : (
                  <div></div>
                )}

                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete Project
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
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            How would you like to delete the project "{project?.project_name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteForMe} color="warning">
            Delete for me
          </Button>
          <Button onClick={handleDeleteForEveryone} color="error">
            Delete for everyone
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
