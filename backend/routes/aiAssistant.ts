import express from "express";
import { askGemini } from "../services/geminiService";
import { routeAction } from "../services/intentRouter";

const router = express.Router();

router.post("/", async (req, res) => {
  const { query, email } = req.body;
  if (!query || !email) {
    return res.status(400).json({ error: "Missing query or email." });
  }

  try {
    const geminiResponse = await askGemini(query);
    const routed = await routeAction(geminiResponse, query, email);
    return res.json(routed);
  } catch (error) {
    return res.status(500).json({ error: "Failed to process request." });
  }
});



export default router;
