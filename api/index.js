import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";  // Import utilities to handle path in ES modules
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import relationshipRoutes from "./routes/relationships.js";
import storyRoutes from "./routes/stories.js";



// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);  // Get current file path
const __dirname = path.dirname(__filename);  // Get directory name

// Create express app
const app = express();

// Apply CORS middleware first
app.use(
  cors({
    origin: "http://localhost:3000",  // Allow requests from frontend
    credentials: true,  // Allow credentials (cookies)
    methods: ["GET", "POST", "PUT", "DELETE"],  // Explicitly allow methods
    allowedHeaders: ["Content-Type", "Authorization"],  // Ensure proper headers
  })
);

app.use(express.json());
app.use(cookieParser());

// Serve static files (uploaded images) from the client/public folder
app.use("/upload", express.static(path.join(__dirname, "../client/public/upload")));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../client/public/upload");  // Use absolute path
    cb(null, uploadPath);  // Ensure directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);  // Generate unique filename
  },
});

const upload = multer({ storage: storage });

// File upload route
app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  if (!file) {
    console.error("File upload failed - no file provided.");
    return res.status(400).json("No file uploaded!");
  }
  res.status(200).json(file.filename);  // Return the uploaded file's filename
});

// Route definitions
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);  // Ensure the route is registered
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/stories", storyRoutes);



// Basic API route to test
app.get("/api", (req, res) => {
  res.send("API is working!");
});

// Start the server
app.listen(8800, () => {
  console.log("API working on port 8800!");
});
