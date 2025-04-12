import NavBar from "../components/NavBar";
import ProfileDetails from "../components/ProfileDetails";
import TaskMeLaterBlueLogo from "../components/TaskMeLaterBlueLogo";
import MyCompletedTasks from "../components/MyCompletedTasks";
const Profile = () => {
  return (
    <>
      <TaskMeLaterBlueLogo />
      <ProfileDetails />
      <MyCompletedTasks />
      <NavBar />
    </>
  );
};

export default Profile;
