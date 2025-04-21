import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { addTaskToProject } from "../services/tasksServices";

const statuses = ["To Do", "In Progress", "Completed"];

export default function AddTaskForm({ projectId, onTaskAdded }) {
  console.log(`Project ID: ${projectId}`);
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("To Do");
  const [details, setDetails] = useState("");
  const [score, setScore] = useState(0);
  const [match, setMatch] = useState(0);
  const [helpReq, setHelpReq] = useState(false);
  const [dependencies, setDependencies] = useState("");

  const handleSubmit = async () => {
    if (!title || !dueDate) return;
    const taskData = {
      task_title: title,
      due_date: dueDate,
      task_status: status,
      task_details: details,
      task_score: Number(score),
      task_match: Number(match),
      help_req: helpReq,
      task_notes: [],
      project_dependencies: dependencies?.trim()
        ? dependencies
            .split(",")
            .map((d) => d.trim())
            .filter(Boolean)
        : [],
    };
    try {
      await addTaskToProject(projectId, taskData);
      if (onTaskAdded) onTaskAdded(taskData);
      setOpen(false);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Add Task
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <TextField
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
          >
            {statuses.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Task Details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
          <TextField
            label="Task Score"
            type="number"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            fullWidth
          />
          <TextField
            label="Match %"
            type="number"
            value={match}
            onChange={(e) => setMatch(e.target.value)}
            fullWidth
          />
          <TextField
            label="Dependencies (comma-separated)"
            value={dependencies}
            onChange={(e) => setDependencies(e.target.value)}
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={helpReq}
                onChange={(e) => setHelpReq(e.target.checked)}
              />
            }
            label="Needs Help"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
