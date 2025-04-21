import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { SkillsForSignUpPage } from "../components/SkillsForSignUpPage";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { Typography } from "@mui/material";
import GoogleAuth from "../components/GoogleAuth";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Stack } from "@mui/material";
import { formatPhoneNumber } from "../components/SkillsForSignUpPage";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function SignUp() {
  const auth = getAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const checkUserExists = async (uid) => {
    try {
      const res = await fetch(`http://localhost:3001/api/users/${uid}`);
      return res.status === 200;
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
      navigate("/create-account");
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

  const handleSubmit = () => {
    console.log(aboutMe, phoneNumber, skills);
  };
  const [aboutMe, setAboutMe] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [skills, setSkills] = useState([]);

  function SkillSelect() {
    const theme = useTheme();
    const [personName, setPersonName] = React.useState([]);

    const handleChange = (event) => {
      const {
        target: { value },
      } = event;
      setPersonName(
        // On autofill we get a stringified value.
        typeof value === "string" ? value.split(",") : value
      );
    };

    const [aboutMe, setAboutMe] = useState("");
    const [phone, setPhone] = useState("");
    const [skills, setSkills] = useState([]);

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log({
        aboutMe,
        phone,
        skills,
      });
    };

    const handleSkillChange = (event) => {
      const {
        target: { value },
      } = event;
      setSkills(typeof value === "string" ? value.split(",") : value);

      return (
        <div>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={personName}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {SkillsForSignUpPage.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  style={getStyles(name, personName, theme)}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      );
    };
    return (
      <>
        <>
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
        </>
        <>
          <Box
            component="form"
            type="submit"
            onSubmit={handleSubmit}
            sx={{
              maxWidth: 500,
              mx: "auto",
              p: 4,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <TextField
              label="About Me"
              multiline
              rows={4}
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel id="skills-label">Skills</InputLabel>
              <Select
                labelId="skills-label"
                multiple
                value={skills}
                onChange={handleSkillChange}
                input={
                  <OutlinedInput id="select-multiple-chip" label="Skills" />
                }
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {SkillsForSignUpPage.map((skill) => (
                  <MenuItem key={skill} value={skill}>
                    {skill}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Stack direction="row" justifyContent="center">
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Stack>
          </Box>
        </>
        <form>
          <input
            placeholder={"About Me"}
            onChange={(e) => setAboutMe(e.target.value)}
            class="p-5 m-5 border-2 border-gray-300"
          ></input>
          <input
            placeholder={"Phone Number"}
            onChange={(e) => setPhoneNumber(e.target.value)}
          ></input>
          <SkillSelect />
        </form>
        <button onClick={handleSubmit}>A</button>
      </>
    );
  }
}
