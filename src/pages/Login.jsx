import GoogleAuth from "../components/GoogleAuth";
import TaskMeLaterBlueLogo from "../components/TaskMeLaterBlueLogo";
import SignUp from "./CreateAccount";
const Login = () => {
  return (
    <>
      <TaskMeLaterBlueLogo />
      <div class="flex flex-col items-center">
        <GoogleAuth />
      </div>
      <SignUp />
    </>
  );
};

export default Login;
