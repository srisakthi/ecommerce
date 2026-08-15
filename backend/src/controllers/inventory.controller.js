import Product from "../models/product.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

const getLowStockProducts = asyncHandler(async (req, res) => {
    const threshold = Number(req.query.threshold) || 10;
    const filter = {
        isDeleted: false,
        stock: { $lte: threshold },
    };

    if (req.user.role === "seller") {
        filter.seller = req.user.id;
    }

    const products = await Product.find(filter).populate("category", "name").sort({ stock: 1 });

    return res.status(200).json(
        new ApiResponse(200, "Low stock products fetched", products)
    );
});

const updateStock = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { stock } = req.body;

    if (typeof stock !== "number" || stock < 0) {
        throw new ApiError(400, "Valid stock quantity is required");
    }

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) throw new ApiError(404, "Product not found");

    if (req.user.role === "seller" && existingProduct.seller?.toString() !== req.user.id.toString()) {
        throw new ApiError(403, "Not authorized to update this product");
    }

    const product = await Product.findByIdAndUpdate(
        productId,
        { stock },
        { new: true }
    );

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(
        new ApiResponse(200, "Stock updated successfully", product)
    );
});

export default {
    getLowStockProducts,
    updateStock,
};
