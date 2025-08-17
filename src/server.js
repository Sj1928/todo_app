import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import connectDB from "./db.js"; // was ../db.js

import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5003;

// File path helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(express.json());

// Static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "../public")));

// Serve main HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html")); // ✅ fixed path
});

// MongoDB connection
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/todos", authMiddleware, todoRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});
