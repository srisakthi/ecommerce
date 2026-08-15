import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import wishlistController from "../controllers/wishlist.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", wishlistController.getWishlist);
router.post("/:productId", wishlistController.addToWishlist);
router.delete("/:productId", wishlistController.removeFromWishlist);

export default router;
