import { Request, Response } from "express";
import twilio from "twilio";

// Twilio credentials and numbers from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER!;
const agentPhone = process.env.AGENT_PHONE_NUMBER  
const serverUrl = process.env.SERVER_URL  
console.log(`sid id ${accountSid} and token is ${authToken} and agent phone no is ${agentPhone} and server url is ${serverUrl}`)
const client = twilio(accountSid, authToken);

// POST /escalate-to-human
// Body: { userPhone: string }
export const escalateToHuman = async (req: Request, res: Response) => {
  const { userPhone } = req.body;
  if (!userPhone) {
    return res.status(400).json({ error: "Missing userPhone in request body." });
  }
  try {
    await client.calls.create({
      url: `${serverUrl}/twilio/voice-bridge`,
      to: userPhone,
      from: twilioNumber,
    });
    res.json({ message: "Call initiated to user, will bridge to agent." });
  } catch (err) {
    res.status(500).json({ error: "Failed to initiate call", details: err });
  }
};

// POST /twilio/voice-bridge
// Twilio webhook to bridge user to agent
export const voiceBridge = (req: Request, res: Response) => {
  const twiml = new twilio.twiml.VoiceResponse();
  twiml.say("Please hold while we connect you to a human support agent.");
  twiml.dial(agentPhone);
  res.type("text/xml");
  res.send(twiml.toString());
};  