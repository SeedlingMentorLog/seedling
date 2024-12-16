const express = require("express");
const cors = require("cors");
const {db, createUsersTable} = require("./config/db");
const getRoutes = require("./routes/getRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();
const PORT = process.env.PORT; // Set your desired port

createUsersTable();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/get", getRoutes);
app.use("/post", postRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
