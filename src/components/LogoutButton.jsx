// components/LogoutButton.tsx
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      console.log("Signed out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Button
      sx={{ m: 2 }}
      size="small"
      variant="contained"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
