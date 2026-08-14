import express from "express";

import productController from "../controllers/product.controller.js";

import authenticate from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    productController.getAllProducts
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
    productController.createProduct
);

router.put(
    "/:id",
    authenticate,
    authorize("admin"),
    productController.updateProduct
);

router.get("/:id", productController.getProductById);

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    productController.deleteProduct
);

router.post(

    "/upload",

    authenticate,

    authorize("admin"),

    upload.single("image"),

    (req, res) => {

        res.status(200).json({

            success: true,

            file: req.file.filename,

            path: `/uploads/products/${req.file.filename}`

        });

    }

);

export default router;