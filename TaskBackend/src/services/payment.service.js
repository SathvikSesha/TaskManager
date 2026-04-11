import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/user.model.js";

class PaymentService {
  #getRazorpayInstance() {
    return new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(tier, userId) {
    if (!["plus", "pro"].includes(tier)) {
      const error = new Error("Invalid tier selected");
      error.statusCode = 400;
      throw error;
    }

    const amount = tier === "plus" ? 99 : 399;
    const razorpay = this.#getRazorpayInstance();

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_order_${userId}`,
    };

    return await razorpay.orders.create(options);
  }

  async verifyPayment(orderId, paymentId, signature, tier, userId) {
    const sign = orderId + "|" + paymentId;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (signature !== expectedSign) {
      const error = new Error("Invalid payment signature!");
      error.statusCode = 400;
      throw error;
    }

    const taskLimit = tier === "plus" ? 150 : 500;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { subscriptionTier: tier, taskLimit: taskLimit },
      { returnDocument: "after" },
    );

    return updatedUser;
  }
}

export default new PaymentService();
