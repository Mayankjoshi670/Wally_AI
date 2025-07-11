import express from "express";
import { handleAiMessage } from "../controllers/aiController";

const router = express.Router();

// POST /api/ai/message
router.post("/message", handleAiMessage);

export default router;
