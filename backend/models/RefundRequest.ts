// models/RefundRequest.ts
import mongoose from "mongoose";

const refundRequestSchema = new mongoose.Schema({
  orderId: String,
  userPhone: String,
  reason: String,
  status: { type: String, default: "pending" }, // pending | approved | rejected
  requestedAt: { type: Date, default: Date.now },
});

export default mongoose.model("RefundRequest", refundRequestSchema);
