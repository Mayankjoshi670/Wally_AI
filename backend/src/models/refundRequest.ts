import mongoose, { Document, Schema } from "mongoose";

export interface IRefundRequest extends Document {
  orderId: string;
  userPhone: string;
  reason: string;
  status?: string;
  requestedAt?: Date;
}

const refundRequestSchema = new Schema<IRefundRequest>({
  orderId: { type: String, required: true },
  userPhone: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, default: "pending" },
  requestedAt: { type: Date, default: Date.now },
});

export const RefundRequest = mongoose.model<IRefundRequest>(
  "RefundRequest",
  refundRequestSchema
);
