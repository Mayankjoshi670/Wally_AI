import { checkOrder, cancelOrder, refundOrder, connectToHuman } from "./orderDb";

function extractOrderId(message: string): string | null {
  const match = message.match(/\b\d{4,}\b/);
  return match ? match[0] : null;
}

export function routeAction(
  { request, talk }: { request: string; talk: string },
  userMessage: string
) {
  const orderId = extractOrderId(userMessage);

  switch (request) {
    case "order_status":
      if (!orderId) return { talk: "Please provide your order ID.", request: "missing_info" };
      return { talk: checkOrder(orderId).message, request };

    case "cancel_order":
      if (!orderId) return { talk: "Order ID is required to cancel.", request: "missing_info" };
      return { talk: cancelOrder(orderId).message, request };

    case "refund_request":
      if (!orderId) return { talk: "Please provide your order ID for the refund.", request: "missing_info" };
      return { talk: refundOrder(orderId).message, request };

    case "speak_to_human":
      return { talk: connectToHuman().message, request };

    default:
      return { talk, request };
  }
}