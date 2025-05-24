const express = require("express");
const cors = require("cors");
const {
  pool,
  intializeDatabase,
} = require("./config/db");
const getRoutes = require("./routes/getRoutes");
const postRoutes = require("./routes/postRoutes");
const admin = require("./config/firebase");

const app = express();
const PORT = process.env.PORT; // Set your desired port

// intializeDatabase();

// Firebase Admin Authentication Middleware
const auth = (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(400)
        .json({ error: "Missing or malformed Authorization header" });
    }

    const tokenId = authHeader.split("Bearer ")[1];
    admin
      .auth()
      .verifyIdToken(tokenId)
      .then((decoded) => {
        req.token = decoded;
        next();
      })
      .catch((error) => {
        console.error("Token verification failed:", error.message);
        res.status(401).json({ error: "Invalid or expired token" });
      });
  } catch (error) {
    console.error("Middleware error:", error.message);
    res.status(400).json({ error: "Invalid token format" });
  }
};

// CORS Middleware
app.options("*", cors());
app.use(cors({
  origin: [
    "http://localhost:3000", 
    "https://seedling-volunteer-portal.vercel.app", // your Vercel frontend
    "https://ymltfgjkfc.execute-api.us-east-2.amazonaws.com", // API Gateway (optional)
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware
app.use(express.json());
app.use(auth);

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
  console.log(`Server is running on ${PORT}`);
});
