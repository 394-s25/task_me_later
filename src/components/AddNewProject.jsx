import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { postNewProject } from "../services/projectService";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firestoreConfig";
import { getAllUsers } from "../services/usersService";

export default function AddNewProject({ onComplete }) {
  const [projId, setProjId] = useState(null);
  const [projName, setProjName] = useState("");
  const [projDetails, setProjDetails] = useState("");
  const [projDueDate, setProjDueDate] = useState("");
  const [projMembers, setProjMembers] = useState([]);
  const [people, setPeople] = useState([]);
  const theme = useTheme();
  
  useEffect(() => {
    const fetchMaxID = async () => {
      try {
        const snapshot = await getDocs(collection(db, "projects"));
        const ids = snapshot.docs
          .map((doc) => parseInt(doc.id))
          .filter(Number.isInteger);
        const max = ids.length ? Math.max(...ids) : 0;
        setProjId(max + 1);
        
        const users = await getAllUsers();
        setPeople(
          users.map((user) => ({ id: user.id, name: user.display_name }))
        );
      } catch (error) {
        console.error("Error fetching project IDs:", error);
      }
    };
    fetchMaxID();
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postNewProject({
        projId,
        projName,
        projDetails,
        projDueDate,
        projMembers,
      });
      console.log("project members", projMembers);
      setProjName("");
      setProjDetails("");
      setProjDueDate("");
      setProjMembers([]);
      if (onComplete) onComplete();
    } catch (err) {
      console.error("Failed to add project:", err);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: 2, maxWidth: 600, mx: "auto" }}
    >
      <TextField
        label="Project Name"
        fullWidth
        required
        value={projName}
        onChange={(e) => setProjName(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Project Details"
        fullWidth
        required
        multiline
        value={projDetails}
        onChange={(e) => setProjDetails(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Due Date"
        type="text"
        fullWidth
        value={projDueDate}
        onChange={(e) => setProjDueDate(e.target.value)}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="members-label">Project Members</InputLabel>
        <Select
          multiple
          value={projMembers}
          onChange={(e) =>
            setProjMembers(
              typeof e.target.value === "string"
                ? e.target.value.split(",")
                : e.target.value
            )
          }
          input={<OutlinedInput label="Project Members" />}
          renderValue={(selectedIds) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selectedIds.map((id) => {
                const user = people.find((p) => p.id === id);
                return <Chip key={id} label={user?.display_name || id} />;
              })}
            </Box>
          )}
        >
          {people.map((person) => (
            <MenuItem
              key={person.id}
              value={person.id}
              style={{
                fontWeight: projMembers.includes(person.id)
                  ? theme.typography.fontWeightMedium
                  : theme.typography.fontWeightRegular,
              }}
            >
              {person.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" fullWidth type="submit">
        Submit New Project
      </Button>
    </Box>
  );
}
