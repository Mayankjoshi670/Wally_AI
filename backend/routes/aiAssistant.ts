import express from "express";
import { askGemini } from "../services/geminiService";
import { routeAction } from "../services/intentRouter";

const router = express.Router();

router.post("/", async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Missing 'query' in request body." });
  }

  try {
    const geminiResponse = await askGemini(query);
    const routed = routeAction(geminiResponse, query);
    return res.json(routed);
  } catch (error) {
    console.error("Error processing Gemini response:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
