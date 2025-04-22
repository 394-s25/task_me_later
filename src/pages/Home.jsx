import TaskCardPreview from "../components/TaskCardPreview";
import NavBar from "../components/NavBar";
import TaskSignupPreview from "../components/SignUpTaskPreview";
import TaskMeLaterBlueLogo from "../components/TaskMeLaterBlueLogo";
const Home = () => {
  return (
    <>
      <TaskMeLaterBlueLogo />
      <div class="mt-18">
        <TaskCardPreview />
        <TaskSignupPreview />
      </div>
      <NavBar />
    </>
  );
};

export default Home;
