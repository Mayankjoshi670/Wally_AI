import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import assistant from "./routes/aiAssistant";
import { connectDB } from "./config/db";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect DB before starting server
connectDB();

const PORT = process.env.PORT || 3000;
app.use("/api/ai-assistant", assistant);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
