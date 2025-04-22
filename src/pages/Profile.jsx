import NavBar from "../components/NavBar";
import ProfileDetails from "../components/ProfileDetails";
import TaskMeLaterBlueLogo from "../components/TaskMeLaterBlueLogo";
import MyCompletedTasks from "../components/MyCompletedTasks";
import LogoutButton from "../components/LogoutButton";
const Profile = () => {
  return (
    <>
      <TaskMeLaterBlueLogo />
      <div class="mt-20">
        {/* <div class="mb-10"></div> */}
        <ProfileDetails />
        <MyCompletedTasks />
        <div class="flex flex-col justify-center items-center">
          <LogoutButton />
        </div>
      </div>
      <NavBar />
    </>
  );
};

export default Profile;
