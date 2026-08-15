import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import couponController from "../controllers/coupon.controller.js";

const router = express.Router();

// Customer
router.post("/apply", authMiddleware, couponController.applyCoupon);

// Admin
router.post("/", authMiddleware, authorizeRoles("admin"), couponController.createCoupon);
router.get("/", authMiddleware, authorizeRoles("admin"), couponController.getAllCoupons);
router.get("/:id", authMiddleware, authorizeRoles("admin"), couponController.getCouponById);
router.put("/:id", authMiddleware, authorizeRoles("admin"), couponController.updateCoupon);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), couponController.deleteCoupon);

export default router;
