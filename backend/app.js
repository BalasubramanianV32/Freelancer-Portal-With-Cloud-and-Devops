const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/jobs", (req, res) => {
  res.json({ jobs: [] });
});

app.post("/jobs", (req, res) => {
  res.json({ message: "Job created", job: req.body });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});