import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import productService from "../services/product.service.js";

const createProduct = asyncHandler(async (req, res) => {

    const product = await productService.createProduct(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            "Product created successfully",
            product
        )
    );

});

const getAllProducts = asyncHandler(async (req, res) => {

    const products = await productService.getAllProducts();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Products fetched successfully",
            products
        )
    );

});

const updateProduct = asyncHandler(async (req, res) => {

    const product = await productService.updateProduct(
        req.params.id,
        req.body
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Product updated successfully",
            product
        )
    );

});

const deleteProduct = asyncHandler(async (req, res) => {

    await productService.deleteProduct(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Product deleted successfully"
        )
    );

});

const getProductById = asyncHandler(async (req, res) => {
    const product = await productService.getProductById(
        req.params.id
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Product fetched successfully",
            product
        )
    );
});

export default {

    createProduct,

    getAllProducts,

    updateProduct,

    deleteProduct,
    getProductById

};