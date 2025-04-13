import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const GoogleAuth = () => {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const credential = GoogleAuthProvider.credential(
          null,
          tokenResponse.access_token
        );
        const auth = getAuth();
        await signInWithCredential(auth, credential);
        await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        navigate("/");
      } catch (err) {
        console.error("Login or fetch error:", err);
      }
    },
    onError: (err) => console.error("Login Failed:", err),
  });
  return (
    <Button variant="contained" onClick={() => login()}>
      Sign in with Google
    </Button>
  );
};

export default GoogleAuth;
