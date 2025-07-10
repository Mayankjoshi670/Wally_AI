import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";
import Order from "../models/Order";
import RefundRequest from "../models/RefundRequest";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/test";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear old data
    await User.deleteMany({});
    await Order.deleteMany({});
    await RefundRequest.deleteMany({});

    // Create sample user
    const user = await User.create({
      name: "Mayank Joshi",
      phone: "9876543210",
      email: "mayank@example.com",
    });

    // Create orders for user
    await Order.insertMany([
      {
        orderId: "1001",
        userPhone: user.phone,
        product: "Wireless Mouse",
        status: "shipped",
        placedAt: new Date("2025-07-05"),
        shippedAt: new Date("2025-07-06"),
        expectedDelivery: new Date("2025-07-12"),
      },
      {
        orderId: "1002",
        userPhone: user.phone,
        product: "Gaming Keyboard",
        status: "delivered",
        placedAt: new Date("2025-06-30"),
        shippedAt: new Date("2025-07-01"),
        outForDeliveryAt: new Date("2025-07-03"),
        deliveredAt: new Date("2025-07-04"),
        expectedDelivery: new Date("2025-07-04"),
      },
      {
        orderId: "1003",
        userPhone: user.phone,
        product: "Laptop Stand",
        status: "cancelled",
        placedAt: new Date("2025-07-01"),
        cancelledAt: new Date("2025-07-02"),
      },
    ]);

    // Create a refund request
    await RefundRequest.create({
      orderId: "1002",
      userPhone: user.phone,
      reason: "Received wrong item",
      status: "pending",
      requestedAt: new Date("2025-07-05"),
    });

    console.log("✅ Database seeded successfully.");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
