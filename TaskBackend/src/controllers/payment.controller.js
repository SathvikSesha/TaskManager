import paymentService from "../services/payment.service.js";

export const createOrder = async (req, res, next) => {
  try {
    const { tier } = req.body;
    const order = await paymentService.createOrder(tier, req.user.id);
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, tier } =
      req.body;

    const updatedUser = await paymentService.verifyPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      tier,
      req.user.id,
    );

    res.json({
      message: "Payment successful! Account upgraded.",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        tier: updatedUser.subscriptionTier,
        taskLimit: updatedUser.taskLimit,
      },
    });
  } catch (error) {
    next(error);
  }
};
