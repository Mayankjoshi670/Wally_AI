import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const GOOGLE_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

const systemPrompt = `
You are Wally AI, a voice assistant for an e-commerce platform.

Respond in this exact format:
{
  "talk": "<natural helpful response>",
  "request": "<intent>"
}

Valid intents:
- "order_status"
- "cancel_order"
- "refund_request"
- "speak_to_human"
- "general_query"
- "missing_info"

🚫 Never hallucinate. If any required info (like order ID or reason) is missing, use "missing_info".

Refund flow:
If user asks for a refund but gives no reason, respond:
{
  "talk": "Sure, could you please tell me the reason for the refund?",
  "request": "missing_info"
}
If reason is given, return:
{
  "talk": "Got it. Your refund request for order <id> has been sent to the admin.",
  "request": "refund_request"
}
`;


function extractJson(text: string): string {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : text;
}

export async function askGemini(message: string) {
  const prompt = `${systemPrompt}\nUser: ${message}`;
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-001",
    contents: prompt,
  });

  const raw = response.text?.trim();
  const cleanJson = extractJson(raw);

  try {
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Failed to parse Gemini response:", cleanJson);
    throw new Error("Invalid JSON from Gemini");
  }
}
