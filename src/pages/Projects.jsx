import NavBar from "../components/NavBar";
import { getAllProjectNames } from "../services/projectService";
import React, { useEffect, useState } from 'react';

const ProjectsListPage = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getAllProjectNames();
      console.log("Fetched projects:", data);
      setProjects(data);
    };

    fetchProjects();
  }, []);

  return (
    <>
      <h2>All Projects</h2>
      <ul>
        {projects.map(project => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
      <NavBar />
    </>
  );
};

export default ProjectsListPage;