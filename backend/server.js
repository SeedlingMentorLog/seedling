const express = require("express");
const cors = require("cors");
const { pool, createUsersTable, createMentorLogsTable, createMentorToStudentTable } = require("./config/db");
const getRoutes = require("./routes/getRoutes");
const postRoutes = require("./routes/postRoutes");
const admin = require("firebase-admin");

const app = express();
const PORT = process.env.PORT; // Set your desired port

// createUsersTable();
// createMentorToStudentTable();
// createMentorLogsTable();

// Firebase Admin Authentication Middleware
const auth = (req, res, next) => {
  try {
    const tokenId = req.get("Authorization").split("Bearer ")[1];
    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        req.token = decoded;
        next();
      })
      .catch((error) => res.status(401).send(error));
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(auth());

// Routes
app.use("/get", getRoutes);
app.use("/post", postRoutes);

process.on("SIGINT", () => {
  console.log("Shutting down server...");
  pool.end((err) => {
    if (err) {
      console.error("Error closing the database pool:", err.message);
    } else {
      console.log("Database pool closed.");
    }
    process.exit();
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
