import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import cartController from "../controllers/cart.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", cartController.getCart);
router.post("/items", cartController.addItem);
router.put("/items/:productId", cartController.updateQuantity);
router.delete("/items/:productId", cartController.removeItem);
router.delete("/", cartController.clearCart);

export default router;
