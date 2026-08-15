import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import addressController from "../controllers/address.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", addressController.getMyAddresses);
router.post("/", addressController.createAddress);
router.get("/:id", addressController.getAddressById);
router.put("/:id", addressController.updateAddress);
router.delete("/:id", addressController.deleteAddress);

export default router;
