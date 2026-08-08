import express from "express";

import verifyJWT from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

import adminController from "../controllers/admin.controller.js";

const router = express.Router();

router.get(

    "/dashboard",

    verifyJWT,

    authorize("admin"),

    adminController.dashboard

);

export default router;