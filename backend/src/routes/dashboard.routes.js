import express from "express";

import dashboardController from "../controllers/dashboard.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.get(

    "/stats",

    authMiddleware,

    authorize("admin", "seller"),

    dashboardController.getDashboardStats

);

export default router;