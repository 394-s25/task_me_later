import React from "react";
import { Chip } from "@mui/material";
import ProjectTag from "./ProjectTag";
const SignUpCard = ({ task, onClick, onSignUp }) => {
  return (
    <div
      className="m-2 border rounded-lg bg-white shadow-md cursor-pointer"
      onClick={() => onClick(task)}
    >
      <div className="flex justify-between items-center mb-3">
        <ProjectTag project={task.project_name} />
        <button
          className="text-gray-400 text-xl mr-2"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          ×
        </button>
      </div>

      <div className="mb-2">
        <h3 className="text-lg font-medium ml-2">{task.task_title}</h3>
        {task.help_req && (
          <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full ml-2">
            Help Needed
          </span>
        )}
      </div>

      <div className="text-sm text-gray-600 mb-2 ml-2">
        Due: {task.due_date}
      </div>

      <div className="flex justify-end mt-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md m-3"
          onClick={(e) => {
            e.stopPropagation();
            onSignUp(task);
          }}
        >
          Sign Up for Task
        </button>
      </div>
    </div>
  );
};

export default SignUpCard;
