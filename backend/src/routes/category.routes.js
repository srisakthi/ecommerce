import express from "express";

import categoryController from "../controllers/category.controller.js";

import authenticate from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    categoryController.getAllCategories
);

router.get(
    "/:slug",
    categoryController.getCategoryBySlug
);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    authenticate,
    authorize("admin"),
    categoryController.createCategory
);

router.put(
    "/:id",
    authenticate,
    authorize("admin"),
    categoryController.updateCategory
);

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    categoryController.deleteCategory
);

export default router;