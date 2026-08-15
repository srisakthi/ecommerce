import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import reviewController from "../controllers/review.controller.js";

const router = express.Router();

// Public
router.get("/product/:productId", reviewController.getProductReviews);

// Customer
router.post("/", authMiddleware, reviewController.createReview);
router.put("/:id", authMiddleware, reviewController.updateReview);
router.delete("/:id", authMiddleware, reviewController.deleteReview);

// Admin
router.get("/admin", authMiddleware, authorizeRoles("admin"), reviewController.getAllReviewsAdmin);

export default router;
