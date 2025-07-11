import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";

// Import your AI route
import aiRoutes from "./routes/aiRoutes";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Test route
app.get("/", (_req, res) => {
  res.send("AI backend is running");
});

// Mount AI routes
app.use("/api/ai", aiRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
