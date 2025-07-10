import Order from "../models/Order";
import Refund from "../models/RefundRequest";
import Chat from "../models/Chat";

// Extract orderId from message (assumes 4+ digit numbers are order IDs)
function extractOrderId(message: string): string | null {
  const match = message.match(/\b\d{4,}\b/);
  return match ? match[0] : null;
}

// Extract refund reason (assumes it's the sentence after saying "because", "due to", etc.)
function extractRefundReason(message: string): string | null {
  const match = message.match(/(?:because|due to|as|for)\s(.+)/i);
  return match ? match[1].trim() : null;
}

export async function routeAction(
  { request, talk }: { request: string; talk: string },
  userMessage: string
) {
  const orderId = extractOrderId(userMessage);

  switch (request) {
    case "order_status": {
      if (!orderId) {
        return { talk: "May I know your order ID?", request: "missing_info" };
      }
      const order = await Order.findOne({ orderId });
      if (!order) return { talk: "Sorry, I couldn't find your order.", request };
      return { talk: `Your order ${orderId} is currently ${order.status}.`, request };
    }

    case "cancel_order": {
      if (!orderId) {
        return { talk: "May I know your order ID to cancel?", request: "missing_info" };
      }
      const order = await Order.findOneAndUpdate({ orderId }, { status: "Cancelled" });
      if (!order) return { talk: "Sorry, I couldn't find your order to cancel.", request };
      return { talk: `Order ${orderId} has been cancelled.`, request };
    }

    case "refund_request": {
      if (!orderId) {
        return { talk: "May I know your order ID for the refund?", request: "missing_info" };
      }

      const reason = extractRefundReason(userMessage);
      if (!reason) {
        return { talk: "Can you tell me the reason for the refund?", request };
      }

      const refund = new Refund({ orderId, reason, status: "Pending" });
      await refund.save();

      return {
        talk: `Refund request for order ${orderId} has been submitted. Admin will review it shortly.`,
        request,
      };
    }

    case "speak_to_human":
      return { talk: "Connecting you to a human agent now...", request };

    case "general_query":
    default:
      return { talk, request };
  }
}
