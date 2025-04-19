import { useEffect, useState } from "react";
import { firebaseConfig } from "../services/firestoreConfig"; // make sure the path is correct
import { collection, addDoc, getFirestore, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
  const [projectNotes, setProjectNotes] = useState([{}]);

  const [projId, setProjId] = useState(null);

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
    console.log({ projName, projDetails, projDueDate, projId });
    setProjName("");
    setProjDetails("");
    setProjDueDate("");
    setTasksTotal(NaN);
  };

  const handleDefaultButton = () => {
    setProjName("DefaultProjName");
    setProjDetails("DefaultProjDetails");
    setProjDueDate("DefaultProjDueDate");
    setTasksTotal(1);
  };

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
          {/* <ProjectTextInput
            inputType={"number"}
            placeHolder={"Number Of Tasks"}
            value={tasksTotal}
            valueSetter={setTasksTotal}
          /> */}
          {/* <ProjectTextInput
            inputType={"string"}
            placeHolder={"Project Name"}
            value={projName}
            valueSetter={setProjName}
          />
          <ProjectTextInput
            inputType={"string"}
            placeHolder={"Project Name"}
            value={projName}
            valueSetter={setProjName}
          /> */}
          <button type="submit">SUBMIT</button>
        </div>
      </form>
      <button onClick={handleDefaultButton}>DEFAULT</button>
      {/* <GetMaxProjectID /> */}
      {/* <button onClick={handleJsonSubmit}>Submit JSON</button> */}
    </>
  );
}
