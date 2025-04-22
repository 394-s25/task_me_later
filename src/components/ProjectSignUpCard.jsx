import React from "react";
import { Chip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const ProjectSignUpCard = ({ task, onClick, onSignUp }) => {
  return (
    <div
      className="bg-white m-2 border rounded-lg shadow-md cursor-pointer"
      onClick={() => onClick(task)}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full ml-2 mr-1"></div>
          <span className="text-xs font-semibold text-blue-500">
            {task.project}
          </span>
        </div>
        <IconButton
          size="small"
          className="text-gray-400 mr-1"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
      <div className="mb-2">
        <h3 className="text-lg font-medium ml-2">{task.task_title}</h3>
        {task.needsHelp && (
          <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full ml-2">
            Help Needed
          </span>
        )}
      </div>
      <div className="text-sm text-gray-600 mb-2 ml-2">
        Due: {task.due_date}
      </div>
      <div className="text-sm text-gray-600 mb-2 ml-2">
        Task Score: {task.task_score}/100
      </div>
      <div className="text-sm text-gray-600 mb-2 ml-2">
        Task Match: {task.task_match}%
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

export default ProjectSignUpCard;
