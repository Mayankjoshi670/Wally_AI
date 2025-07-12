import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";

// Import your AI route
import aiRoutes from "./routes/aiRoutes";
import chatRoutes from "./routes/chatRoutes";
import { escalateToHuman, voiceBridge } from './controllers/callController';
import axios from 'axios';

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

// Register the route
app.post('/escalate-to-human', escalateToHuman);
app.post('/twilio/voice-bridge', voiceBridge);

// Mount AI routes
app.use("/api/ai", aiRoutes);

// Mount Chat routes
app.use("/api/chat", chatRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
