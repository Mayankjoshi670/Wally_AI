import mongoose, { Document, Schema } from "mongoose";

export interface IChat extends Document {
  userId?: mongoose.Types.ObjectId;
  message: string;
  request: string;
  timestamp?: Date;
}

const chatSchema = new Schema<IChat>({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  message: { type: String, required: true },
  request: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const Chat = mongoose.model<IChat>("Chat", chatSchema);
