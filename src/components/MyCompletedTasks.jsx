import { Card } from "@mui/material";
import { useEffect, useState } from "react";
import { getUsersTasks } from "../services/tasksServices";
import TaskCardModal from "./TaskCardModal";

export default function MyCompletedTasks() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = getUsersTasks((fetchedTasks) => {
      const filtered = fetchedTasks.filter(
        (task) => task.task_status === "Completed"
      );
      setCompletedTasks(filtered);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Card
      sx={{
        marginX: "auto",
        marginY: 2,
        width: "90%",
        backgroundColor: "#f8f8f8",
        padding: 2,
      }}
    >
      <h1 className="font-bold mb-2">My Completed Tasks</h1>
      {completedTasks.length > 0 ? (
        <ul className="list-disc ml-5">
          {completedTasks.map((task) => (
            <li
              key={task.id}
              className="cursor-pointer hover:text-blue-600 transition"
              onClick={() => {
                setSelectedTask(task);
                setOpen(true);
              }}
            >
              {task.task_title}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No completed tasks yet.</p>
      )}
      <TaskCardModal
        task={selectedTask}
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedTask(null);
        }}
        setTask={setSelectedTask}
        allTasks={completedTasks}
      />
    </Card>
  );
}
