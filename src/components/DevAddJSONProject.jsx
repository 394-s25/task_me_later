import { useState } from "react";
import { firebaseConfig } from "../services/firestoreConfig"; // make sure the path is correct
import { collection, doc, setDoc, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function DevAddJSONProject() {
  const [jsonInput, setJsonInput] = useState("");

  const handleJsonSubmit = async (e) => {
    e.preventDefault();

    try {
      const parsed = JSON.parse(jsonInput);

      // Ensure project_id is defined
      if (!parsed.project_id) {
        throw new Error("Missing project_id in JSON.");
      }

      // Create a document with project_id as the Document ID
      const docRef = doc(db, "projects", parsed.project_id.toString());
      await setDoc(docRef, parsed);

      console.log("Project added via JSON with custom Document ID!");
    } catch (error) {
      console.error("Error adding project: ", error.message);
    }
  };

  return (
    <>
      <textarea
        placeholder="Paste full JSON here"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        className="p-2 w-full h-40 bg-gray-100 mt-4"
      />
      <button onClick={handleJsonSubmit}>Submit JSON</button>
    </>
  );
}
