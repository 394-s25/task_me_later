import TaskCardPreview from "../components/TaskCardPreview";
import NavBar from "../components/NavBar";
import TaskSignupPreview from "../components/SignUpTaskPreview";
import TaskMeLaterBlueLogo from "../components/TaskMeLaterBlueLogo";
const Home = () => {
  return (
    <>
      <TaskMeLaterBlueLogo />
      <TaskCardPreview />
      <TaskSignupPreview />
      <NavBar />
    </>
  );
};

export default Home;
