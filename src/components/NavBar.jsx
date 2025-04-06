import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EmailIcon from "@mui/icons-material/Email";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import Profile from "../pages/Profile";

export default function NavBar() {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();
  const goToProfile = () => {
    navigate("/Profile");
  };
  return (
    <Box sx={{ pb: 7 }}>
      <CssBaseline />
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Projects" icon={<AssignmentIcon />} />
          <BottomNavigationAction label="Messages" icon={<EmailIcon />} />
          <BottomNavigationAction
            label="Profile"
            icon={<AccountCircleIcon />}
            onClick={goToProfile}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
