import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import inventoryController from "../controllers/inventory.controller.js";

const router = express.Router();

router.use(authMiddleware, authorizeRoles("admin", "seller"));

router.get("/low-stock", inventoryController.getLowStockProducts);
router.put("/:productId/stock", inventoryController.updateStock);

export default router;
