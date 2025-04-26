import ProjectCardPreview from "../components/ProjectCardPreview";
import NavBar from "../components/NavBar";
import TaskMeLaterBlueLogo from "../components/TaskMeLaterBlueLogo";
import AddNewProject from "../components/AddNewProject";
import { IconButton, Button, Dialog, DialogTitle } from "@mui/material";
import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { getAllProjects } from "../services/projectService";

const Projects = () => {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState([]);

  const refreshProjects = async () => {
    console.log("Refreshing projects...");
    const data = await getAllProjects();
    console.log("New projects data:", data);
    setProjects(data);
  };

  useEffect(() => {
    refreshProjects();
  }, []);

  return (
    <>
      <TaskMeLaterBlueLogo />
      <div className="pt-20">
        <div className="flex justify-start mb-4 ml-6 mr-6 mt-2 px-6">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Add Project
          </Button>
        </div>
      </div>
      <ProjectCardPreview
        projects={projects}
        onProjectUpdated={refreshProjects}
      />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Add New Project
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <AddNewProject
          onComplete={async () => {
            setOpen(false);
            await refreshProjects();
          }}
        />
      </Dialog>
      <NavBar />
    </>
  );
};

export default Projects;
