import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import { Button } from "@mui/material";
import { useState } from "react";
import Chip from "@mui/material/Chip";
import ProjectCardModal from "./ProjectCardModal";
import projectData from "../../mock_data.json"; // Assuming you'll update your mock data to include projects

export default function ProjectCardPreview() {
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(-1);

  const handleCardClick = (project) => {
    setOpen(true);
    setSelectedProject(project);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setSelectedProject(-1);
  };

  const ProgressChip = ({ project }) => {
    // Determine status based on completed vs total tasks
    const tasksCompleted = project.tasks_completed || 0;
    const tasksTotal = project.tasks_total || 0;
    const tasksRemaining = tasksTotal - tasksCompleted;

    let status = "Completed";
    let chipColor = "lightgreen";
    let textColor = "black";

    if (tasksRemaining === tasksTotal) {
      status = "Not Started";
      chipColor = "red";
      textColor = "white";
    } else if (tasksRemaining > 0) {
      status = "In Progress";
      chipColor = "orange";
      textColor = "black";
    }

    return (
      <Chip
        label={status}
        size="small"
        style={{
          backgroundColor: chipColor,
          color: textColor,
        }}
      />
    );
  };

  const calculateProgress = (project) => {
    const tasksCompleted = project.tasks_completed || 0;
    const tasksTotal = project.tasks_total || 0;

    if (tasksTotal === 0) return 0;
    return (tasksCompleted / tasksTotal) * 100;
  };

  return (
    <>
      <div className="bg-gray-100 rounded-2xl">
        <div className="flex flex-wrap justify-center items-center mx-auto bg-gray">
          {projectData.projects &&
            projectData.projects.map((projectItem) => (
              <React.Fragment key={projectItem.id || projectItem.project_name}>
                <Card
                  className="w-64 m-3 border rounded-2xl"
                  onClick={() => {
                    handleCardClick(projectItem);
                    console.log(projectItem);
                  }}
                >
                  <CardActionArea>
                    <CardContent>
                      <h1 className="font-bold">{projectItem.project_name}</h1>
                      <p className="text-xs mt-1">
                        Details:{" "}
                        {projectItem.details ||
                          "This is the description for the project."}
                      </p>
                      <p className="text-xs mt-2">
                        Tasks: {projectItem.tasks_completed || 0} Completed,{" "}
                        {projectItem.tasks_total -
                          projectItem.tasks_completed || 0}{" "}
                        Remaining
                      </p>
                      <div className="mt-2">
                        <ProgressChip project={projectItem} />
                      </div>
                      <p className="text-xs mt-2">
                        Due: {projectItem.due_date}
                      </p>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${calculateProgress(projectItem)}%`,
                          }}
                        ></div>
                      </div>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </React.Fragment>
            ))}
        </div>
      </div>
      {selectedProject !== -1 && (
        <ProjectCardModal
          project={selectedProject}
          open={open}
          onClose={handleDialogClose}
          setProject={setSelectedProject}
        />
      )}
    </>
  );
}
