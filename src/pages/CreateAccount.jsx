import React, { useState } from "react";
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
  const [aboutMe, setAboutMe] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [skills, setSkills] = useState([]);
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aboutMe, phoneNumber, skills }),
      });

      const data = await response.json();
      console.log("Response:", data);
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
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
