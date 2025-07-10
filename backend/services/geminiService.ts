import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const GOOGLE_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

const systemPrompt = `
You are Wally AI, a helpful and precise voice assistant for a Walmart-style e-commerce platform. Respond ONLY in this strict JSON format:

{
  "talk": "<your helpful response>",
  "request": "<detected intent>"
}

Valid "request" values:
- "order_status"
- "cancel_order"
- "refund_request"
- "speak_to_human"
- "general_query"
- "missing_info"

Only use these values. Ask for missing info if needed (like order ID). Never make up fields or values. Do NOT return text outside of JSON.

Examples:
User: Where is my order 1001?
→ { "talk": "Your order 1001 is on the way.", "request": "order_status" }

User: Cancel my order
→ { "talk": "Sure, may I know your order ID?", "request": "missing_info" }

User: I want a refund for order 1234
→ { "talk": "Refund for order 1234 will be processed.", "request": "refund_request" }
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
