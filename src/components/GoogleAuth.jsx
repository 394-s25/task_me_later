import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Card } from "@mui/material";
import GoogleImg from "../imgs/google.png";
import Welcome2TMLImg from "../imgs/welcome2tml.png";
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
    <div class="flex flex-col justify-center items-center">
      <div>
        <img
          src={Welcome2TMLImg}
          class="max-w-[300px] h-[70px] mt-45 mb-20"
        ></img>
      </div>
      <div>
        <Card class="flex flex-col items-center drop-shadow-2xl shadow-md p-4 w-[300px] h-[150px] bg-gray-200 rounded-2xl">
          <button
            onClick={() => login()}
            class="bg-[#8db1fd] p-3 rounded-md mb-3 flex flex-row"
          >
            <img src={GoogleImg} class="w-5 mt-1 mr-2"></img>
            Log In With Google
          </button>
          <button
            onClick={() => SignUpCard()}
            class="border-3 border-[#8db1fd] p-3 rounded-md flex flex-row"
          >
            <img src={GoogleImg} class="w-5 mt-0.5 mr-2"></img>
            Sign Up With Google
          </button>
        </Card>
      </div>
    </div>
  );
};

export default GoogleAuth;
