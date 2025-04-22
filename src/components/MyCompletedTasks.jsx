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
        <div className="space-y-2">
          {completedTasks.map((task) => (
            <div
              key={task.id}
              className="p-2 bg-white rounded-md shadow-sm border border-gray-200 
                         flex items-center cursor-pointer 
                         hover:bg-blue-50 hover:border-blue-300 transition-all"
              onClick={() => {
                setSelectedTask(task);
                setOpen(true);
              }}
            >
              <div className="flex-grow">
                <p className="font-medium text-gray-800">{task.task_title}</p>
              </div>
              <span className="text-blue-600 text-sm">View details → </span>
            </div>
          ))}
        </div>
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
