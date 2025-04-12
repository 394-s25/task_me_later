import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Card } from "@mui/material";
import GoogleAuth from "./GoogleAuth";
import React, { useState } from "react";

export default function ProfileDetails() {
  const [user, setUser] = useState(null);
  const handleUserChange = (userData) => {
    setUser(userData);
  };

  const Title = ({ title }) => {
    return <h3 class="text-[17px] font-bold">{title}</h3>;
  };
  const Details = ({ details }) => {
    return <h3 class="text-[14px] break-words ">{details}</h3>;
  };
  return (
    <>
      <Card sx={{ marginX: "auto", width: "90%", backgroundColor: "#f8f8f8" }}>
        <div class="flex flex-row">
          <div class="max-w-[30%] flex flex-col items-center m-2">
            <AccountCircleIcon class="size-20" />
            <div class="text-center">
              <h1>{user ? user.name : "Spencer Arch Silverstein"}</h1>
              <h1 class="text-[12px]">user_name03</h1>

              <GoogleAuth user={user} onUserChange={handleUserChange} />
            </div>
          </div>
          <div class="w-[60%] mx-auto m-4">
            <div class="relative rounded-lg p-5 items-center mx-auto bg-[#8db1fd] text-white italic text-[20px]">
              <Title title="About Me" />
              <Details details="I am a Senior at NU and a Full-Stack Developer." />
              <Title title="Skills" />
              <Details details="React, Typescript, JavaScript, Tailwind, GitHub,Google Cloud" />
              <Title title="Contact" />
              <Details details="Email: archiesilverstein2025@u.northwestern.edu" />
              <Details details="Phone: (917)-331-8285" />
            </div>
          </div>
        </div>
      </Card>
      {/* <hr class="w-[90%] mx-auto justify-center" /> */}
    </>
  );
}
