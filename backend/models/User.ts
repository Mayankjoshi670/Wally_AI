import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, required: true, unique: true },
  email: String,
});

export default mongoose.model("User", userSchema);
