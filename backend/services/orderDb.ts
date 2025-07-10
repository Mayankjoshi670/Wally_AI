// // Mock order database and service functions
// const orders = [
//   { id: "1001", status: "shipped", canCancel: true },
//   { id: "1002", status: "processing", canCancel: true },
//   { id: "1003", status: "delivered", canCancel: false },
// ];

// export function checkOrder(orderId: string) {
//   const order = orders.find((o) => o.id === orderId);
//   if (!order) return { success: false, message: "Order not found." };
//   return { success: true, status: order.status };
// }

// export function cancelOrder(orderId: string) {
//   const order = orders.find((o) => o.id === orderId);
//   if (!order) return { success: false, message: "Order not found." };
//   if (!order.canCancel) return { success: false, message: "Order cannot be cancelled." };
//   order.status = "cancelled";
//   order.canCancel = false;
//   return { success: true, message: "Order cancelled successfully." };
// }

// export function refundOrder(orderId: string) {
//   const order = orders.find((o) => o.id === orderId);
//   if (!order) return { success: false, message: "Order not found." };
//   if (order.status !== "delivered" && order.status !== "cancelled") {
//     return { success: false, message: "Refund not available for this order status." };
//   }
//   return { success: true, message: "Refund initiated." };
// }

// export function connectToHuman() {
//   return { success: true, message: "Connecting you to a human agent now..." };
// }


export function checkOrder(orderId: string) {
  return { success: true, message: `Your order ${orderId} is being prepared.` };
}

export function cancelOrder(orderId: string) {
  return { success: true, message: `Order ${orderId} has been cancelled.` };
}

export function refundOrder(orderId: string) {
  return { success: true, message: `Refund for order ${orderId} has been initiated.` };
}

export function connectToHuman() {
  return { success: true, message: "Connecting you to a human agent..." };
}
