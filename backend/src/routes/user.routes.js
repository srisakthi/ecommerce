import express from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import userController from "../controllers/user.controller.js";

const router = express.Router();

// Customer User Routes
router.get("/profile", verifyJWT, userController.profile);
router.put("/profile", verifyJWT, userController.updateProfile);

// Admin User Routes
router.get("/", verifyJWT, authorizeRoles("admin"), userController.getAllUsers);
router.post("/", verifyJWT, authorizeRoles("admin"), userController.createUser);
router.get("/:id", verifyJWT, authorizeRoles("admin"), userController.getUserById);
router.put("/:id", verifyJWT, authorizeRoles("admin"), userController.updateUser);
router.delete("/:id", verifyJWT, authorizeRoles("admin"), userController.deleteUser);

export default router;