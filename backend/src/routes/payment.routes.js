import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import paymentController from "../controllers/payment.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/create-intent", paymentController.createPaymentIntent);
router.post("/verify", paymentController.verifyPayment);

export default router;
