import { useGoogleLogin } from "@react-oauth/google";
import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../services/firestoreConfig";

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
        const result = await signInWithCredential(auth, credential);
        const user = result.user;
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            email: user.email,
          });
          navigate("/create_account");
        } else {
          navigate("/");
        }
      } catch (err) {
        console.error("Login or fetch error:", err);
      }
    },
    onError: (err) => console.error("Login Failed:", err),
  });
  return (
    <Button startIcon={<GoogleIcon />} onClick={() => login()} fullWidth>
      Log In with Google
    </Button>
  );
};

export default GoogleAuth;
