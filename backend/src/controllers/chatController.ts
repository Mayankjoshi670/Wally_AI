import { Request, Response } from "express";
import { chatCode } from "../services/geminiService";
import { Chat } from "../models/chat";
import { User } from "../models/user";
import { Order } from "../models/order";
import { RefundRequest } from "../models/refundRequest";
import axios from 'axios';

export const handleChatMessage = async (req: Request, res: Response) => {
  const { message, userPhone } = req.body;

  try {
    const user = await User.findOne({ phone: userPhone });
    if (!user) {
      return res.json({ response: "Sorry, we couldn't find your account. Please check your phone number or register first." });
    }
    const orders = await Order.find({ userPhone });
    const refunds = await RefundRequest.find({ userPhone });

    // Get more chat history for conversational context (last 10 messages)
    const chatHistory = await Chat.find({ userId: user?._id })
      .sort({ timestamp: -1 })
      .limit(10);

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
You are a friendly, helpful, and conversational AI assistant for a Walmart-like store. The user is chatting with you via text message. You should be warm, engaging, and conversational while still being able to help with order-related tasks.

Your personality:
- Friendly and approachable, like chatting with a helpful friend
- Use emojis and casual language appropriately
- Be conversational and engaging
- Remember previous conversation context
- Show empathy and understanding

User Info:
- Name: ${user?.name || "Unknown"}
- Phone: ${userPhone}

Order Data:
${formattedOrders || 'No orders found.'}

Recent Chat History:
${historyText}

Current Message:
"${message}"

Your capabilities:
- Help with order tracking, cancellation, and refunds
- Answer general questions about products, services, policies
- Engage in casual conversation
- Escalate to human agent when needed
- Remember context from previous messages

Instructions:
- Use the order data above for any order-related questions
- Be conversational and engaging, not robotic
- If the user asks about orders, use the real data provided
- If you need clarification, ask in a friendly way
- If the user wants to escalate, be helpful and supportive
- Maintain conversation flow and context

Respond ONLY in this strict JSON format:
{
  "response": "Conversational, friendly reply to the user",
  "intent": "chat | track_order | cancel_order | refund_request | connect_human | unknown",
  "orderId": "1004", // if relevant, else null
  "actionRequired": true | false,
  "missingData": "ask user for refund reason | ask for order id | null"
}
`;

    const aiResponse = await chatCode(context);
    // Parse LLM structured output
    let parsed;
    try {
      parsed = JSON.parse(aiResponse.match(/{[\s\S]+}/)?.[0] || "");
    } catch {
      await Chat.create({ userId: user?._id, message, request: "Sorry, I didn't get that. Could you please repeat?" });
      return res.json({ response: "Sorry, I didn't get that. Could you please repeat?" });
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

    // Business logic for track_order
    if (intent === "track_order" && actionRequired) {
      // The LLM already has the order data and will provide accurate status
      await Chat.create({ userId: user?._id, message, request: response });
      return res.json({ response });
    }

    // Business logic for cancel_order
    if (intent === "cancel_order" && actionRequired) {
      if (!orders || orders.length === 0) {
        await Chat.create({ userId: user?._id, message, request: "You don't have any orders to cancel." });
        return res.json({ response: "You don't have any orders to cancel." });
      }
      
      if (orderId) {
        const order = await Order.findOne({ orderId, userPhone });
        if (!order) {
          await Chat.create({ userId: user?._id, message, request: `No order found with ID ${orderId}.` });
          return res.json({ response: `No order found with ID ${orderId}.` });
        }
        if (order.status === "cancelled" || order.status === "delivered") {
          await Chat.create({ userId: user?._id, message, request: `Order ${orderId} cannot be cancelled (already ${order.status}).` });
          return res.json({ response: `Order ${orderId} cannot be cancelled (already ${order.status}).` });
        }
        order.status = "cancelled";
        order.cancelledAt = new Date();
        await order.save();
      } else {
        // No orderId provided - cancel most recent cancellable order
        const latestOrder = orders.find(
          (o) => o.status !== "cancelled" && o.status !== "delivered"
        );
        if (!latestOrder) {
          await Chat.create({ userId: user?._id, message, request: "You don't have any cancellable orders." });
          return res.json({ response: "You don't have any cancellable orders." });
        }
        latestOrder.status = "cancelled";
        latestOrder.cancelledAt = new Date();
        await latestOrder.save();
      }
    }

    // Business logic for refund_request
    if (intent === "refund_request" && actionRequired) {
      if (!orders || orders.length === 0) {
        await Chat.create({ userId: user?._id, message, request: "You don't have any orders to refund." });
        return res.json({ response: "You don't have any orders to refund." });
      }
      
      if (orderId) {
        const order = await Order.findOne({ orderId, userPhone });
        if (!order) {
          await Chat.create({ userId: user?._id, message, request: `No order found with ID ${orderId}.` });
          return res.json({ response: `No order found with ID ${orderId}.` });
        }
        if (order.status !== "delivered") {
          await Chat.create({ userId: user?._id, message, request: `Order ${orderId} cannot be refunded (not delivered).` });
          return res.json({ response: `Order ${orderId} cannot be refunded (not delivered).` });
        }
        await RefundRequest.create({
          orderId: order.orderId,
          userPhone,
          reason: message.length < 100 ? "Requested via AI assistant" : message,
        });
      } else {
        // No orderId provided - refund most recent delivered order
        const latestDelivered = orders.find((o) => o.status === "delivered");
        if (!latestDelivered) {
          await Chat.create({ userId: user?._id, message, request: "You don't have any delivered orders to refund." });
          return res.json({ response: "You don't have any delivered orders to refund." });
        }
        await RefundRequest.create({
          orderId: latestDelivered.orderId,
          userPhone,
          reason: message.length < 100 ? "Requested via AI assistant" : message,
        });
      }
    }

    // If intent is "connect_human" and actionRequired is true, trigger escalation
    if (intent === "connect_human" && actionRequired) {
      // For chat, we can either trigger a call or just acknowledge the request
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

    // For regular chat, just save and return response
    await Chat.create({ userId: user?._id, message, request: response });
    return res.json({ response });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get chat history for a user
export const getChatHistory = async (req: Request, res: Response) => {
  const { userPhone } = req.params;

  try {
    const user = await User.findOne({ phone: userPhone });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const chatHistory = await Chat.find({ userId: user._id })
      .sort({ timestamp: 1 })
      .limit(50);

    res.json({ chatHistory });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Clear chat history for a user
export const clearChatHistory = async (req: Request, res: Response) => {
  const { userPhone } = req.params;

  try {
    const user = await User.findOne({ phone: userPhone });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await Chat.deleteMany({ userId: user._id });
    res.json({ message: "Chat history cleared successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}; 