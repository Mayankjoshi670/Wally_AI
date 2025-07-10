// models/Order.ts
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: String,
  userPhone: String,
  product: String,
  status: String, // e.g., "placed", "shipped", "out_for_delivery", "delivered", "cancelled"
  placedAt: Date,
  shippedAt: Date,
  outForDeliveryAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  expectedDelivery: Date,
});

export default mongoose.model("Order", orderSchema);
