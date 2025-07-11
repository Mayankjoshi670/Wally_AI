import { Request, Response } from "express";
import { animationCode } from "../services/geminiService";
import { Chat } from "../models/chat";
import { User } from "../models/user";
import { Order } from "../models/order";
import { RefundRequest } from "../models/refundRequest";
import axios from 'axios'; // Make sure this is imported

export const handleAiMessage = async (req: Request, res: Response) => {
  const { message, userPhone } = req.body;

  try {
    const user = await User.findOne({ phone: userPhone });
    if (!user) {
      return res.json({ response: "Sorry, we couldn't find your account. Please check your phone number or register first." });
    }
    const orders = await Order.find({ userPhone });
    const refunds = await RefundRequest.find({ userPhone });

    if (!orders || orders.length === 0) {
      return res.json({ response: "You don't have any orders yet. How can I assist you today?" });
    }

    const chatHistory = await Chat.find({ userId: user?._id })
      .sort({ timestamp: -1 })
      .limit(3);

    const historyText = chatHistory
      .map((chat) => `User: ${chat.message}\nAssistant: ${chat.request}`)
      .reverse()
      .join("\n");

    // Format all user orders for LLM context
    const formattedOrders = orders.map((order, idx) => {
      return `Order ${idx + 1}:
  - Order ID: ${order.orderId}
  - Product: ${order.product}
  - Status: ${order.status}
  - Placed At: ${order.placedAt ? order.placedAt.toDateString() : 'N/A'}
  - Shipped At: ${order.shippedAt ? order.shippedAt.toDateString() : 'N/A'}
  - Out For Delivery At: ${order.outForDeliveryAt ? order.outForDeliveryAt.toDateString() : 'N/A'}
  - Delivered At: ${order.deliveredAt ? order.deliveredAt.toDateString() : 'N/A'}
  - Cancelled At: ${order.cancelledAt ? order.cancelledAt.toDateString() : 'N/A'}
  - Expected Delivery: ${order.expectedDelivery ? order.expectedDelivery.toDateString() : 'N/A'}
`;
    }).join('\n');

    const context = `
You are a highly expressive, friendly, and empathetic AI voice assistant for a Walmart-like store. The user is interacting with you over a phone call (text-based input, to be converted to speech). Your job is to understand the user's intent, use recent chat history for context, and provide natural, human-like, and context-aware replies.

User Info:
- Name: ${user?.name || "Unknown"}
- Phone: ${userPhone}

Order Data:
${formattedOrders || 'No orders found.'}

Current Message:
"${message}"

Instructions:
- If you need any order information, use the data above. Always use the real data for your reply.
- If the user asks about a specific order, reference the correct product, status, and dates from the order data.
- If the order is not found, explain that to the user.
- If the user asks for a refund, only process it for delivered orders.
- If the user asks to cancel, only process for orders that are not delivered or cancelled.
- If the user asks to track, use the order data for status and delivery info.
- If you need clarification, ask the user in a friendly, conversational way.

Reply as a real human agent on a call, including any 'thinking' or 'pause' and the answer, in a single, natural message.
Respond ONLY in this strict JSON format:
{
  "response": "..."
}
`;

    const aiResponse = await animationCode(context);
    // Parse LLM structured output
    let parsed;
    try {
      parsed = JSON.parse(aiResponse.match(/{[\s\S]+}/)?.[0] || "");
    } catch {
      await Chat.create({ userId: user?._id, message, request: "Sorry, I didn’t get that. Could you please repeat?" });
      return res.json({ response: "Sorry, I didn’t get that. Could you please repeat?" });
    }

    const { response, intent, orderId, actionRequired, missingData } = parsed;

    // Fallback for unknown or missing response
    if (!response) {
      await Chat.create({ userId: user?._id, message, request: "Sorry, I didn't understand. Could you clarify?" });
      return res.json({ response: "Sorry, I didn't understand. Could you clarify?" });
    }

    // If missingData, just return the LLM's response
    if (missingData && missingData !== 'null') {
      await Chat.create({ userId: user?._id, message, request: response });
      return res.json({ response });
    }

    // Business logic for cancel_order
    if (intent === "cancel_order" && actionRequired && orderId) {
      const order = await Order.findOne({ orderId, userPhone });
      if (order && order.status !== "cancelled" && order.status !== "delivered") {
        order.status = "cancelled";
        order.cancelledAt = new Date();
        await order.save();
      }
    }

    // Business logic for refund_request
    if (intent === "refund_request" && actionRequired && orderId) {
      const order = await Order.findOne({ orderId, userPhone });
      if (order && order.status === "delivered") {
        await RefundRequest.create({
          orderId: order.orderId,
          userPhone,
          reason: message.length < 100 ? "Requested via AI assistant" : message,
        });
      }
    }

    // If intent is "connect_human" and actionRequired is true, trigger Twilio call
    if (intent === "connect_human" && actionRequired) {
      // Trigger Twilio call via your ngrok endpoint
      try {
        await axios.post(
          process.env.SERVER_URL + '/escalate-to-human',
          { userPhone },
          { headers: { 'Content-Type': 'application/json' } }
        );
        console.log('Escalation triggered for', userPhone);
      } catch (err) {
        console.error('Failed to escalate to human:', err);
      }
      await Chat.create({ userId: user?._id, message, request: response });
      return res.json({ response });
    }

    // Save chat and return response
    await Chat.create({ userId: user?._id, message, request: response });
    return res.json({ response });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
