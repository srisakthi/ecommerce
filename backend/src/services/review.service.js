import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import Order from "../models/Order.js";
import ApiError from "../utils/ApiError.js";

const updateProductRatingStats = async (productId) => {
    const reviews = await Review.find({ product: productId, isApproved: true });
    const totalReviews = reviews.length;
    const rating = totalReviews > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) : 0;
    await Product.findByIdAndUpdate(productId, { rating: Number(rating.toFixed(1)), totalReviews });
};

const createReview = async (userId, { productId, rating, title, comment }) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Verify purchase
    const hasPurchased = await Order.findOne({
        user: userId,
        "items.product": productId,
        orderStatus: { $in: ["delivered", "shipped", "confirmed", "processing", "pending"] },
    });

    if (!hasPurchased) {
        throw new ApiError(403, "You can only review products you have ordered");
    }

    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
        throw new ApiError(409, "You have already reviewed this product");
    }

    const review = await Review.create({
        user: userId,
        product: productId,
        rating,
        title,
        comment,
    });

    await updateProductRatingStats(productId);

    return Review.findById(review._id).populate("user", "firstName lastName");
};

const getProductReviews = async (productId) => {
    return Review.find({ product: productId, isApproved: true })
        .populate("user", "firstName lastName")
        .sort({ createdAt: -1 });
};

const updateReview = async (reviewId, userId, { rating, title, comment }) => {
    const review = await Review.findOne({ _id: reviewId, user: userId });
    if (!review) {
        throw new ApiError(404, "Review not found or non-authorized");
    }

    if (rating) review.rating = rating;
    if (title !== undefined) review.title = title;
    if (comment) review.comment = comment;

    await review.save();
    await updateProductRatingStats(review.product);

    return Review.findById(review._id).populate("user", "firstName lastName");
};

const deleteReview = async (reviewId, userId, userRole) => {
    const query = userRole === "admin" ? { _id: reviewId } : { _id: reviewId, user: userId };
    const review = await Review.findOne(query);
    if (!review) {
        throw new ApiError(404, "Review not found or non-authorized");
    }

    const productId = review.product;
    await Review.findByIdAndDelete(review._id);
    await updateProductRatingStats(productId);

    return true;
};

const getAllReviewsAdmin = async () => {
    return Review.find()
        .populate("user", "firstName lastName email")
        .populate("product", "name thumbnail")
        .sort({ createdAt: -1 });
};

export default {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview,
    getAllReviewsAdmin,
};
