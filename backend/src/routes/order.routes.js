import express from "express";

import orderController from "../controllers/order.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();


// ========================================
// CUSTOMER
// ========================================

router.post(
    "/",
    authMiddleware,
    orderController.createOrder
);


router.get(
    "/my-orders",
    authMiddleware,
    orderController.getMyOrders
);


router.get(
    "/my-orders/:id",
    authMiddleware,
    orderController.getMyOrderById
);


// ========================================
// ADMIN
// ========================================

router.get(
    "/",
    authMiddleware,
    authorizeRoles("admin", "seller"),
    orderController.getAllOrders
);


router.put(
    "/:id/status",
    authMiddleware,
    authorizeRoles("admin", "seller"),
    orderController.updateOrderStatus
);


export default router;