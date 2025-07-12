import express from "express";
import { handleChatMessage, getChatHistory, clearChatHistory } from "../controllers/chatController";

const router = express.Router();

// POST /chat/message - Send a chat message
router.post("/message", handleChatMessage);

// GET /chat/history/:userPhone - Get chat history for a user
router.get("/history/:userPhone", getChatHistory);

// DELETE /chat/history/:userPhone - Clear chat history for a user
router.delete("/history/:userPhone", clearChatHistory);

export default router; 