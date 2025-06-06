import React, { useState, useEffect } from "react";
import SignUpCard from "./SignUpCard";
import { getUnassignedTasks, signUpForTask } from "../services/tasksServices";
import { getAvailableTasks } from "../services/tasksServices";

const TaskSignupPreview = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const [signedUpTasks, setSignedUpTasks] = useState([]);

  useEffect(() => {
    //this line below
    const unsubscribe = getAvailableTasks((fetchedTasks) => {
      console.log("Fetched unassigned tasks:", fetchedTasks);
      setTasks(fetchedTasks);
    });

    return () => unsubscribe();
  }, []);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleSignUp = async (task) => {
    try {
      await signUpForTask(task.id);
      setSignedUpTasks([...signedUpTasks, task]);
      setTasks(tasks.filter((t) => t.id !== task.id));
    } catch (error) {
      console.error("Error signing up for task:", error);
    }
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
                <span className="font-medium">{task.task_title}</span> -{" "}
                {task.project_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskSignupPreview;
