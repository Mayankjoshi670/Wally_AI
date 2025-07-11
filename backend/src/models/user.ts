import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name?: string;
  phone: string;
  email?: string;
}

const userSchema = new Schema<IUser>({
  name: String,
  phone: { type: String, required: true, unique: true },
  email: String,
});

export const User = mongoose.model<IUser>("User", userSchema);
