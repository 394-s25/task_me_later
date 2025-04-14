import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  Chip,
  InputLabel,
  FormControl,
  OutlinedInput,
  Box,
  Stack,
} from "@mui/material";
import {
  formatPhoneNumber,
  SkillsForSignUpPage,
} from "../components/SkillsForSignUpPage";

const SignUp = () => {
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
  };

  return (
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
          input={<OutlinedInput id="select-multiple-chip" label="Skills" />}
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
  );
};

export default SignUp;
