import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { createUser, getUserById } from "../services/usersService";
import { TextField, Button, Box, Typography } from "@mui/material";
import GoogleAuth from "../components/GoogleAuth";
import { useNavigate } from "react-router-dom";

const SignUpLoginPage = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      const response = await signInWithEmailAndPassword(auth, email, password);
      const result = response.data();
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

  return (
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
      <Typography variant="h5" align="center">
        Sign Up
      </Typography>

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
        Sign In / Sign Up
      </Button>
      <GoogleAuth />
    </Box>
  );
};

export default SignUpLoginPage;
