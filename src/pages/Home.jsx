import TaskCardPreview from "../components/TaskCardPreview";
import NavBar from "../components/NavBar";
import TaskSignupPreview from "../components/SignUpTaskPreview";

const Home = () => {
  return (
    <>
      <TaskCardPreview />
      <TaskSignupPreview />
      <NavBar />
    </>
  );
};

export default Home;
