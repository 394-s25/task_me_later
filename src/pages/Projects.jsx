import ProjectCardPreview from "../components/ProjectCardPreview";
import NavBar from "../components/NavBar";
import TaskMeLaterBlueLogo from "../components/TaskMeLaterBlueLogo";
import AddNewProject from "../components/AddNewProject";
// import DevAddJSONProject from "../components/DevAddJSONProject";
const Projects = () => {
  return (
    <>
      <TaskMeLaterBlueLogo />
      <ProjectCardPreview />
      <AddNewProject />
      {/* <DevAddJSONProject /> */}
      <NavBar />
    </>
  );
};

export default Projects;
