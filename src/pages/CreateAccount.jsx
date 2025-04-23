import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { SkillsForSignUpPage } from "../components/SkillsForSignUpPage";
import { db } from "../services/firestoreConfig";
import { doc, updateDoc } from "firebase/firestore";
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 300,
    },
  },
};

function getStyles(name, selectedSkills, theme) {
  return {
    fontWeight: selectedSkills.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function SignUp() {
  const [displayName, setDisplayName] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [skills, setSkills] = useState([]);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const user = getAuth().currentUser;
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = getAuth().currentUser;
      if (!user) {
        throw new Error("No user found");
      }
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        aboutMe,
        phoneNumber,
        skills,
        display_name: displayName || user.displayName || "",
      });
      if (!user.displayName && displayName) {
        await updateProfile(user, { displayName });
      }
      navigate("/");
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
      <TextField
        label="Display Name"
        variant="outlined"
        fullWidth
        margin="normal"
        required
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <TextField
        label="About Me"
        variant="outlined"
        fullWidth
        margin="normal"
        value={aboutMe}
        onChange={(e) => setAboutMe(e.target.value)}
      />
      <TextField
        label="Phone Number"
        variant="outlined"
        fullWidth
        margin="normal"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />

      <FormControl sx={{ mt: 2, width: "100%" }}>
        <InputLabel id="skills-label">Skills</InputLabel>
        <Select
          labelId="skills-label"
          multiple
          value={skills}
          onChange={(e) =>
            setSkills(
              typeof e.target.value === "string"
                ? e.target.value.split(",")
                : e.target.value
            )
          }
          input={<OutlinedInput id="select-multiple-chip" label="Skills" />}
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
              style={getStyles(name, skills, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" type="submit" sx={{ mt: 3 }}>
        Sign Up
      </Button>
    </Box>
  );
}
