import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import categoryService from "../services/category.service.js";

const createCategory = asyncHandler(async (req, res) => {

    const categoryData = { ...req.body, seller: req.user.id };
    const category =
        await categoryService.createCategory(
            categoryData
        );

    return res.status(201).json(

        new ApiResponse(

            201,

            "Category created successfully",

            category

        )

    );

});

const getAllCategories = asyncHandler(async (req, res) => {

    const categories =
        await categoryService.getAllCategories(req.query);

    return res.status(200).json(

        new ApiResponse(

            200,

            "Categories fetched successfully",

            categories

        )

    );

});

const getCategoryBySlug = asyncHandler(async (req, res) => {

    const category =
        await categoryService.getCategoryBySlug(
            req.params.slug
        );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Category fetched successfully",

            category

        )

    );

});

const updateCategory = asyncHandler(async (req, res) => {

    const existingCategory = await categoryService.getCategoryById(req.params.id);
    if (!existingCategory) {
        throw new ApiError(404, "Category not found");
    }
    
    if (req.user.role === "seller" && existingCategory.seller?.toString() !== req.user.id.toString()) {
        throw new ApiError(403, "Not authorized to update this category");
    }

    const category =
        await categoryService.updateCategory(

            req.params.id,

            req.body

        );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Category updated successfully",

            category

        )

    );

});

const deleteCategory = asyncHandler(async (req, res) => {

    const existingCategory = await categoryService.getCategoryById(req.params.id);
    if (!existingCategory) {
        throw new ApiError(404, "Category not found");
    }
    
    if (req.user.role === "seller" && existingCategory.seller?.toString() !== req.user.id.toString()) {
        throw new ApiError(403, "Not authorized to delete this category");
    }

    await categoryService.deleteCategory(
        req.params.id
    );

    return res.status(200).json(

        new ApiResponse(

            200,

            "Category deleted successfully"

        )

    );

});

export default {

    createCategory,

    getAllCategories,

    getCategoryBySlug,

    updateCategory,

    deleteCategory

};