import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import assistantRoutes from "./routes/aiAssistant";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api/ai-assistant", assistantRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});