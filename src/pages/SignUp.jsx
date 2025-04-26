import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import tml_logo_blue from "../imgs/tml_logo_blue.png";
import { createUser, getUserById } from "../services/usersService";
import { TextField, Button, Box, Typography, Card } from "@mui/material";
import GoogleAuth from "../components/GoogleAuth";
import { useNavigate } from "react-router-dom";
import Welcome2TMLImg from "../imgs/welcome2tml.png";
import TaskMeLaterBlueLogo from "../components/TaskMeLaterBlueLogo";

const SignInWithEmailComponent = ({
  email,
  setEmail,
  password,
  setPassword,
  handleEmailSignIn,
}) => {
  return (
    <div class="border-2 border-blue-300 mx-10 rounded-md mt-10">
      <img src={Welcome2TMLImg} class="mt-5 w-[90%] flex mx-auto"></img>
      <Box
        sx={{
          maxWidth: 400,
          margin: "auto",
          padding: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <h1 class="text-lg text-center font-bold">Sign In With Email</h1>
        <TextField
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" onClick={handleEmailSignIn} fullWidth>
          Sign In
        </Button>
        <div class="flex items-center w-full mt-5">
          <hr className="flex-grow border-t border-black" />
          <span className="mx-4 text-black font-medium">OR</span>
          <hr className="flex-grow border-t border-black" />
        </div>
        <div class="border-2 border-blue-400 rounded-xl mt-5">
          <GoogleAuth />
        </div>
      </Box>
    </div>
  );
};

const SignUpWithEmail = ({
  email,
  setEmail,
  password,
  setPassword,
  handleEmailSignIn,
}) => {
  return (
    <div class="border-2 border-blue-300 mx-10 rounded-md mt-10">
      <img src={Welcome2TMLImg} class="mt-5 w-[90%] flex mx-auto"></img>
      <Box
        sx={{
          maxWidth: 400,
          margin: "auto",
          padding: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <h5 class=" text-center font-bold text-gray-500">
          Sign up to manage tasks on your next big group project.
        </h5>
        <div class="border-2 border-blue-400 rounded-xl mt-5">
          <GoogleAuth />
        </div>
        <div class="flex items-center w-full my-5">
          <hr className="flex-grow border-t border-black" />
          <span className="mx-4 text-black font-medium">OR</span>
          <hr className="flex-grow border-t border-black" />
        </div>
        <TextField
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" onClick={handleEmailSignIn} fullWidth>
          Sign Up
        </Button>
      </Box>
    </div>
  );
};

const SignUpLoginPage = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingInWithEmail, setSigningInWithEmail] = useState(true);
  // const [signingUp, setSigningUp] = useState(false);

  const checkUserExists = async (uid) => {
    try {
      const user = await getUserById(uid);
      return user !== null;
    } catch (err) {
      console.error("Error checking user existence:", err);
      return false;
    }
  };

  const handlePostLogin = async (user) => {
    const exists = await checkUserExists(user.uid);
    if (exists) {
      navigate("/");
    } else {
      await createUser(user);
      navigate("/create_account");
    }
  };

  const handleEmailSignIn = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await handlePostLogin(result.user);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        try {
          const result = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          await handlePostLogin(result.user);
        } catch (createError) {
          console.error("Error creating user:", createError.message);
        }
      } else if (error.message === "EMAIL_NOT_FOUND") {
        console.log("caught the email not found");
      } else {
        console.error("Sign-in error:", error.message);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await handlePostLogin(result.user);
    } catch (error) {
      console.error("Google Sign-In error:", error.message);
    }
  };

  const handleTakingUserToSignUpPage = () => {
    setEmail("");
    setPassword("");
    setSigningInWithEmail(!signingInWithEmail);
  };

  const LinkToSignUpPage = () => {
    return (
      <div class="border-2 border-blue-300 mx-10 rounded-md mt-3 p-5">
        <h3 class="text-center">
          Don't have an account?{" "}
          <a
            onClick={handleTakingUserToSignUpPage}
            class="text-blue-600 font-bold"
          >
            Sign Up
          </a>
        </h3>
      </div>
    );
  };

  const LinkToLogInPage = () => {
    return (
      <div class="border-2 border-blue-300 mx-10 rounded-md mt-3 p-5">
        <h3 class="text-center">
          Don't have an account?{" "}
          <a
            onClick={handleTakingUserToSignUpPage}
            class="text-blue-600 font-bold"
          >
            Log In
          </a>
        </h3>
      </div>
    );
  };

  return (
    <>
      {signingInWithEmail ? (
        <>
          <SignInWithEmailComponent
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleEmailSignIn={handleEmailSignIn}
          />
          <LinkToSignUpPage />
        </>
      ) : (
        <>
          <SignUpWithEmail
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleEmailSignIn={handleEmailSignIn}
          />
          <LinkToLogInPage />
        </>
      )}
    </>
  );
};

export default SignUpLoginPage;
