import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Card } from "@mui/material";
import React from "react";
import { useAuthContext } from "../services/userProvider";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firestoreConfig";

export default function ProfileDetails() {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setProfile(userSnap.data());
        }
      }
    };
    fetchUserData();
  }, [user]);

  const Title = ({ title }) => {
    return <h3 class="text-[17px] font-bold">{title}</h3>;
  };

  const Details = ({ details }) => {
    return <h3 class="text-[14px] break-words ">{details}</h3>;
  };

  return (
    <>
      <Card sx={{ marginX: "auto", width: "90%", backgroundColor: "#f8f8f8" }}>
        <div class="text-center items-center justify-center flex flex-col mt-5">
          {user && user.photoURL ? (
            <img src={user.photoURL} class="rounded-[100%] mb-3 size-22"></img>
          ) : (
            <>
              <AccountCircleIcon class="size-25 mt-[-10px]" />
            </>
          )}
          <h1>
            {profile && profile.display_name ? profile.display_name : "No name"}
          </h1>
          <h2 class="break-words">
            {profile && profile.email ? profile.email : "No email"}
          </h2>
        </div>
        <div>
          <div class="w-[90%] mx-auto m-4">
            <div class="relative rounded-lg p-5 items-center mx-auto bg-[#8db1fd] text-white italic text-[20px]">
              <Title title="About Me" />
              <Details details={profile?.aboutMe || "No About Me"} />
              <Title title="Skills" />
              <Details details={profile?.skills?.join(", ") || "No Skills"} />
              <Title title="Contact" />
              <Details details={`Email: ${user?.email || "No email"}`} />
              <Details
                details={`Phone: ${profile?.phoneNumber || "No phone number"}`}
              />
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
