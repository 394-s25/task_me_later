import { useEffect, useState } from "react";
import { firebaseConfig } from "../services/firestoreConfig"; // make sure the path is correct
import { collection, addDoc, getFirestore, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
import {
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Box,
  Chip,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { postNewProject } from "../services/projectService";

function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}
function ProjectTextInput({ inputType, placeHolder, value, valueSetter }) {
  return (
    <input
      type={inputType}
      placeholder={placeHolder}
      value={value}
      onChange={(e) => valueSetter(e.target.value)}
      required
      class="p-2 bg-gray-100 "
    />
  );
}
export default function AddNewProject() {
  //   const [projId, setProjId] = useState(0);
  const [projName, setProjName] = useState("");
  const [projDetails, setProjDetails] = useState("");
  const [projDueDate, setProjDueDate] = useState("");
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [tasksTotal, setTasksTotal] = useState(0);
  const [teamContributions, setTeamContributions] = useState([{}]);
  const [myTasks, setMyTasks] = useState([{}]);
  const [teamTasks, setTeamTasks] = useState([{}]);
  const [availableTasks, setAvailableTasks] = useState([{}]);
  const [projNotes, setProjNotes] = useState([{}]);
  const [projId, setProjId] = useState(null);
  const [projMembers, setProjMembers] = useState([]);
  const theme = useTheme();
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
  useEffect(() => {
    const fetchMaxID = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const ids = querySnapshot.docs
          .map((doc) => parseInt(doc.id))
          .filter(Number.isInteger);
        const max = Math.max(...ids);
        setProjId(max + 1);
      } catch (error) {
        console.error("Error fetching document IDs: ", error);
      }
    };

    fetchMaxID();
  }, []);

  const handleAddProject = async (e) => {
    e.preventDefault();
    console.log({ projId, projName, projDetails, projDueDate, projMembers });

    setProjName("");
    setProjDetails("");
    setProjDueDate("");
    setProjMembers([]);
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setProjMembers(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handleDefaultButton = () => {
    setProjName("DefaultProjName");
    setProjDetails("DefaultProjDetails");
    setProjDueDate("DefaultProjDueDate");
    setProjMembers(["Member0", "Member1"]);
  };
  const name = ["Member0", "Member1"];

  return (
    <>
      <form onSubmit={handleAddProject}>
        <div class="flex flex-col justify-center items-center gap-5">
          <ProjectTextInput
            inputType={"string"}
            placeHolder={"Project Name"}
            value={projName}
            valueSetter={setProjName}
          />
          <ProjectTextInput
            inputType={"string"}
            placeHolder={"Project Details"}
            value={projDetails}
            valueSetter={setProjDetails}
          />
          <ProjectTextInput
            inputType={"string"}
            placeHolder={"Project Due Date"}
            value={projDueDate}
            valueSetter={setProjDueDate}
          />
          <div>
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={projMembers}
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
                {name.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, projMembers, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <button type="submit">SUBMIT</button>
        </div>
      </form>
      <button onClick={handleDefaultButton}>DEFAULT</button>
      {/* <GetMaxProjectID /> */}
      {/* <button onClick={handleJsonSubmit}>Submit JSON</button> */}
    </>
  );
}
