import React from "react";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import LogoutIcon from "@mui/icons-material/Logout";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";

const GoogleAuth = ({ user, onUserChange }) => {
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log("Login Success:", codeResponse);
      fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`
      )
        .then((res) => res.json())
        .then((data) => {
          onUserChange(data);
          console.log("Successfully logged in:", {
            name: data.name,
            email: data.email,
          });
        })
        .catch((err) => console.log("Error fetching user info:", err));
    },
    onError: (error) => {
      console.log("Login Failed:", error);
    },
  });

  const handleSignOut = () => {
    googleLogout();
    onUserChange(null);
    console.log("Successfully logged out");
  };

  const isSignedIn = (user) => !!user;

  return (
    <div className="flex space-x-2 mt-2">
      {!isSignedIn(user) ? (
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          onClick={() => login()}
          sx={{
            backgroundColor: "#4285F4",
            color: "white",
            "&:hover": {
              backgroundColor: "#357ae8",
            },
          }}
        >
          Sign in with Google
        </Button>
      ) : (
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleSignOut}
          sx={{
            borderColor: "#d32f2f",
            color: "#d32f2f",
            "&:hover": {
              backgroundColor: "rgba(211, 47, 47, 0.04)",
              borderColor: "#b71c1c",
            },
          }}
        >
          Sign Out
        </Button>
      )}
    </div>
  );
};

export default GoogleAuth;
