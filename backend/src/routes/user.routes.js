import express from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import userController from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile",verifyJWT, userController.profile);
//router.delete("/product/:id", verifyJWT, authorizeRoles("admin"), productController.deleteProduct);

export default router;