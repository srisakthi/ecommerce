import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import reviewService from "../services/review.service.js";

const createReview = asyncHandler(async (req, res) => {
    const review = await reviewService.createReview(req.user.id, req.body);
    return res.status(201).json(
        new ApiResponse(201, "Review created successfully", review)
    );
});

const getProductReviews = asyncHandler(async (req, res) => {
    const reviews = await reviewService.getProductReviews(req.params.productId);
    return res.status(200).json(
        new ApiResponse(200, "Reviews fetched successfully", reviews)
    );
});

const updateReview = asyncHandler(async (req, res) => {
    const review = await reviewService.updateReview(req.params.id, req.user.id, req.body);
    return res.status(200).json(
        new ApiResponse(200, "Review updated successfully", review)
    );
});

const deleteReview = asyncHandler(async (req, res) => {
    await reviewService.deleteReview(req.params.id, req.user.id, req.user.role);
    return res.status(200).json(
        new ApiResponse(200, "Review deleted successfully")
    );
});

const getAllReviewsAdmin = asyncHandler(async (req, res) => {
    const reviews = await reviewService.getAllReviewsAdmin();
    return res.status(200).json(
        new ApiResponse(200, "All reviews fetched successfully", reviews)
    );
});

export default {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview,
    getAllReviewsAdmin,
};
