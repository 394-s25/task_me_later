import React, { useEffect, useState, useRef } from "react";
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
import { Alert, Snackbar } from "@mui/material";
import { SkillsForSignUpPage } from "../components/SkillsForSignUpPage";
import { db } from "../services/firestoreConfig";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth, updateProfile, deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const TIMEOUT_DURATION = 5 * 60 * 1000;
const WARNING_DURATION = 30 * 1000;
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
  const [showWarning, setShowWarning] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const warningRef = useRef(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      warningRef.current = setTimeout(() => {
        setShowWarning(true);
      }, TIMEOUT_DURATION - WARNING_DURATION);

      timeoutRef.current = setTimeout(async () => {
        try {
          const userRef = doc(db, "users", user.uid);
          await deleteDoc(userRef);
          await deleteUser(user);
          navigate("/sign_up");
        } catch (err) {
          console.error("Error deleting incomplete account: ", err);
          navigate("/sign_up");
        }
      }, TIMEOUT_DURATION);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const extendSession = () => {
    setShowWarning(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(timeoutRef.current);

    warningRef.current = setTimeout(() => {
      setShowWarning(true);
    }, TIMEOUT_DURATION - WARNING_DURATION);

    timeoutRef.current = setTimeout(async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      try {
        const userRef = doc(db, "users", user.uid);
        await deleteDoc(userRef);
        await deleteUser(user);
        navigate("/sign_up");
      } catch (err) {
        console.error("Error deleting incomplete account: ", err);
        navigate("/sign_up");
      }
    }, TIMEOUT_DURATION);
  };

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
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
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
      <Snackbar
        open={showWarning}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="warning"
          sx={{ width: "100%" }}
          action={
            <Button color="inherit" size="small" onClick={extendSession}>
              I'm here
            </Button>
          }
        >
          Are you still there? Your progress will be lost in 30 seconds.
        </Alert>
      </Snackbar>
    </Box>
  );
}
