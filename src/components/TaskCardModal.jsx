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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
  addNoteToTask,
  updateNoteInTask,
  updateTaskNotes,
} from "../services/tasksServices";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getOrCreateConversation } from "../services/messagesService";

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
  const navigate = useNavigate();
  const currentUserId = getAuth().currentUser?.uid;
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const [newNoteText, setNewNoteText] = React.useState("");
  const [editingNoteIndex, setEditingNoteIndex] = React.useState(-1);
  const [editingNoteText, setEditingNoteText] = React.useState("");

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

  const handleAddNote = async () => {
    const note = {
      user: getAuth().currentUser.displayName || "Unknown",
      userId: currentUserId,
      details: newNoteText.trim(),
      timestamp: new Date().toISOString(),
    };
    try {
      await addNoteToTask(task.id, note);
      setTask((prev) => ({
        ...prev,
        task_notes: [...(prev.task_notes || []), note],
      }));
      setNewNoteText("");
    } catch (err) {
      console.error("Failed to add note: ", err);
    }
  };

  const handleSaveEditedNote = async (index) => {
    const oldNote = task.task_notes[index];
    const newNote = {
      ...oldNote,
      details: editingNoteText.trim(),
    };
    try {
      await updateNoteInTask(task.id, oldNote, newNote);
      setTask((prev) => {
        const updatedNotes = [...prev.task_notes];
        updatedNotes[index] = newNote;
        return { ...prev, task_notes: updatedNotes };
      });
      setEditingNoteIndex(-1);
      setEditingNoteText("");
    } catch (err) {
      console.error("Failed to update note: ", err);
    }
  };

  const handleDeleteNote = async (noteIndex) => {
    try {
      const updatedNotes = [...task.task_notes];
      updatedNotes.splice(noteIndex, 1);

      await updateTaskNotes(task.id, updatedNotes);

      setTask((prev) => ({
        ...prev,
        task_notes: updatedNotes,
      }));
    } catch (err) {
      console.error("Failed to delete note: ", err);
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
              <div>
                <h1 className="font-bold">
                  Assigned To
                  {task.assigned_name &&
                  task.assigned_name !== "Unassigned" &&
                  task.assigned_to !== currentUserId ? (
                    <span
                      onClick={async () => {
                        const conversationId = await getOrCreateConversation(
                          currentUserId,
                          task.assigned_to
                        );
                        navigate(`/chat/${conversationId}`, {
                          state: {
                            displayName: task.assigned_name,
                          },
                        });
                      }}
                      className="text-blue-600 cursor-pointer underline ml-2"
                    >
                      {task.assigned_name}
                    </span>
                  ) : (
                    <span className="ml-2">
                      {task.assigned_name || "Unassigned"}
                    </span>
                  )}
                </h1>
              </div>
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
            <h1 className="font-bold text-[19px]">Notes</h1>
            {task.task_notes?.map((note, index) => (
              <div key={index} className="mb-2">
                {editingNoteIndex === index ? (
                  <>
                    <input
                      type="text"
                      value={editingNoteText}
                      onChange={(e) => setEditingNoteText(e.target.value)}
                      className="border p-1 w-full"
                    />
                    <div className="flex gap-2 mt-1">
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleSaveEditedNote(index)}
                      >
                        Save
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setEditingNoteIndex(-1)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <li className="text-[14px]">{note.details}</li>
                    {note.userId === currentUserId ? (
                      <>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex flex-col">
                            <p className="text-gray-500 text-xs">
                              {note.user} -{" "}
                              {new Date(note.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setEditingNoteIndex(index);
                                setEditingNoteText(note.details);
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteNote(index)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex flex-col">
                            <p className="text-gray-500 text-xs">
                              {note.user} -{" "}
                              {new Date(note.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            ))}

            <div className="mt-4">
              <h2 className="font-bold text-[16px]">Add a Note</h2>
              <textarea
                rows="3"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="border w-full p-2 mt-2"
                placeholder="Write your note here..."
              />
              <Button
                variant="contained"
                className="mt-2"
                onClick={handleAddNote}
                disabled={!newNoteText.trim()}
              >
                Add Note
              </Button>
            </div>
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
