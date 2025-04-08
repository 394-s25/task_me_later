import React, { useState } from "react";
import SignUpCard from "./SignUpCard";

const sampleTasks = [
  {
    id: 1,
    project: "Story Board Project",
    title: "Finalise Design with Team",
    dueDate: "04/02/2025",
    details: "This is the description for the task.",
    match: "80%",
    needsHelp: true,
  },
  {
    id: 2,
    project: "CS 3XX Project",
    title: "Create Demo",
    dueDate: "04/07/2025",
    details: "This is the description for the task.",
    match: "90%",
    needsHelp: true,
  },
];

const TaskSignupPreview = () => {
  const [tasks, setTasks] = useState(sampleTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [signedUpTasks, setSignedUpTasks] = useState([]);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    console.log("Task clicked:", task);
  };

  const handleSignUp = (task) => {
    setSignedUpTasks([...signedUpTasks, task]);

    setTasks(tasks.filter((t) => t.id !== task.id));
    console.log(`Signed up for task: ${task.title}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Sign Up For Tasks</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <SignUpCard
            key={task.id}
            task={task}
            onClick={handleTaskClick}
            onSignUp={handleSignUp}
          />
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center p-6 bg-white rounded-lg shadow-md mt-6">
          <p className="text-lg text-gray-700">
            No more tasks available for signup.
          </p>
        </div>
      )}

      {signedUpTasks.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Your Signed Up Tasks</h2>
          <ul className="bg-white rounded-lg shadow-md p-4">
            {signedUpTasks.map((task) => (
              <li key={task.id} className="py-2 border-b last:border-0">
                <span className="font-medium">{task.title}</span> -{" "}
                {task.project}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskSignupPreview;
