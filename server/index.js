// server/index.js
const express = require("express");
const cors = require("cors");
const { db } = require("./firebase");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express backend!" });
});

app.post("/api/users", async (req, res) => {
  try {
    const userData = req.body;

    if (!userData || !userData.uid) {
      return res.status(400).json({ error: "Missing required fields: uid" });
    }

    await db.collection("users").doc(userData.uid).set(userData);
    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
