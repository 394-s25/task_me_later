import React, {useState} from "react";
import { Chip, Menu, MenuItem } from "@mui/material";
import ProjectTag from "./ProjectTag";
const SignUpCard = ({ task, onClick, onSignUp }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
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

      <div className="text-sm text-gray-600 mb-2 ml-2">
        {Array.isArray(task.assigned_name) ? (
          <>
            <span
              className="cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                handleMenuOpen(e);
              }}
            >
              Assigned to
            </span>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={(e) => {
                e.stopPropagation();
                handleMenuClose();
              }}
              PaperProps={{
                style: { maxHeight: 200, width: "20ch" },
              }}
            >
              {task.assigned_name.map((name) => (
                <MenuItem
                  key={name}
                  disabled
                  sx={{ cursor: "default", color: "text.primary" }}
                >
                  {name}
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <span className="text-red-500">Unassigned</span>
        )}
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
