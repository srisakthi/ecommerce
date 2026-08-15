import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import Order from "../models/Order.js";

const createPaymentIntent = asyncHandler(async (req, res) => {
    const { orderId } = req.body;
    const order = await Order.findOne({ _id: orderId, user: req.user.id });
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    // Dev payment abstraction returns a payment session/intent object
    const paymentIntent = {
        clientSecret: `pi_mock_${Date.now()}_secret_${Math.floor(Math.random() * 10000)}`,
        amount: order.totalAmount,
        currency: "inr",
        orderId: order._id,
        status: "requires_payment_method",
    };

    return res.status(200).json(
        new ApiResponse(200, "Payment intent created successfully", paymentIntent)
    );
});

const verifyPayment = asyncHandler(async (req, res) => {
    const { orderId, paymentId, status = "paid" } = req.body;
    const order = await Order.findOne({ _id: orderId, user: req.user.id });
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (status === "paid") {
        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";
        await order.save();
    } else {
        order.paymentStatus = "failed";
        await order.save();
    }

    return res.status(200).json(
        new ApiResponse(200, "Payment verified successfully", order)
    );
});

export default {
    createPaymentIntent,
    verifyPayment,
};
