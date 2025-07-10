// models/Chat.ts
import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  message: String,
  request: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Chat", ChatSchema);
