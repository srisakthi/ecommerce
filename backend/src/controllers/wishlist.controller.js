import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import wishlistService from "../services/wishlist.service.js";

const getWishlist = asyncHandler(async (req, res) => {
    const wishlist = await wishlistService.getWishlist(req.user.id);
    return res.status(200).json(
        new ApiResponse(200, "Wishlist fetched successfully", wishlist)
    );
});

const addToWishlist = asyncHandler(async (req, res) => {
    const wishlist = await wishlistService.addToWishlist(req.user.id, req.params.productId);
    return res.status(200).json(
        new ApiResponse(200, "Product added to wishlist", wishlist)
    );
});

const removeFromWishlist = asyncHandler(async (req, res) => {
    const wishlist = await wishlistService.removeFromWishlist(req.user.id, req.params.productId);
    return res.status(200).json(
        new ApiResponse(200, "Product removed from wishlist", wishlist)
    );
});

export default {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
};
