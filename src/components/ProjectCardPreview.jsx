import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import { useState } from "react";
import Chip from "@mui/material/Chip";
import ProjectCardModal from "./ProjectCardModal";

export default function ProjectCardPreview({ projects, onProjectUpdated }) {
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

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
    } else if (tasksRemaining > 0 || !project?.completed) {
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

  const isProjectCompleted = (project) => {
    return project.completed || false;
  };

  const currentProjects = projects.filter((p) => !isProjectCompleted(p));
  const pastProjects = projects.filter((p) => isProjectCompleted(p));

  // Project card component to avoid duplicating code
  const ProjectCard = ({ projectItem }) => (
    <Card
      className="w-35 m-3 border rounded-2xl h-52" // Added fixed height h-52 (13rem)
      onClick={() => {
        handleCardClick(projectItem);
        console.log(projectItem);
      }}
    >
      <CardActionArea className="h-full">
        <CardContent className="h-full flex flex-col">
          <div>
            <h1 className="font-bold mt-[-7px]">{projectItem.project_name}</h1>
            <h1 className="text-[12px]">Due: {projectItem.due_date}</h1>
          </div>
          <hr className="my-2" />
          <div className="mt-1">
            <ProgressChip project={projectItem} />
          </div>
          <hr className="my-2" />
          <div className="mt-auto">
            <p className="text-xs mt-1">
              Tasks: {projectItem.tasks_completed} / {projectItem.tasks_total}
            </p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
              <div
                className="bg-blue-600 h-1 rounded-full"
                style={{
                  width: `${calculateProgress(projectItem)}%`,
                }}
              ></div>
            </div>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );

  return (
    <>
      <div className="bg-gray-100 rounded-2xl p-4 w-full max-w-4xl mx-auto">
        <h2
          className="text-2xl font-bold mb-4 ml-4"
          style={{ color: "#77A1F3" }}
        >
          My Current Projects
        </h2>
        <div className="grid grid-cols-2 gap-4 mx-auto">
          {currentProjects.length > 0 ? (
            currentProjects.map((projectItem, index) => (
              <div
                key={`current-${projectItem.project_id || index}`}
                className={
                  index % 2 === 0 ? "justify-self-end" : "justify-self-start"
                }
              >
                <ProjectCard projectItem={projectItem} />
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic text-center col-span-2">
              No current projects
            </p>
          )}
        </div>

        {/* Past Projects Section */}
        <h2
          className="text-2xl font-bold mt-8 mb-4 ml-4"
          style={{ color: "#77A1F3" }}
        >
          My Past Projects
        </h2>
        <div className="grid grid-cols-2 gap-4 mx-auto">
          {pastProjects.length > 0 ? (
            pastProjects.map((projectItem, index) => (
              <div
                key={`past-${projectItem.project_id || index}`}
                className={
                  index % 2 === 0 ? "justify-self-end" : "justify-self-start"
                }
              >
                <ProjectCard projectItem={projectItem} />
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic text-center col-span-2">
              No past projects
            </p>
          )}
        </div>
      </div>

      <ProjectCardModal
        project={selectedProject}
        open={open}
        onClose={handleDialogClose}
        setProject={setSelectedProject}
        onProjectUpdated={onProjectUpdated}
      />
    </>
  );
}
