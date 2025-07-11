import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  orderId: string;
  userPhone: string;
  product: string;
  status: string;
  placedAt?: Date;
  shippedAt?: Date;
  outForDeliveryAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  expectedDelivery?: Date;
}

const orderSchema = new Schema<IOrder>({
  orderId: { type: String, required: true },
  userPhone: { type: String, required: true },
  product: String,
  status: String,
  placedAt: Date,
  shippedAt: Date,
  outForDeliveryAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  expectedDelivery: Date,
});

export const Order = mongoose.model<IOrder>("Order", orderSchema);
