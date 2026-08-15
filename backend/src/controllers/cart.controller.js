import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import cartService from "../services/cart.service.js";

const getCart = asyncHandler(async (req, res) => {
    const cart = await cartService.getCart(req.user.id);
    return res.status(200).json(
        new ApiResponse(200, "Cart fetched successfully", cart)
    );
});

const addItem = asyncHandler(async (req, res) => {
    const cart = await cartService.addItemToCart(req.user.id, req.body);
    return res.status(200).json(
        new ApiResponse(200, "Item added to cart", cart)
    );
});

const updateQuantity = asyncHandler(async (req, res) => {
    const cart = await cartService.updateItemQuantity(
        req.user.id,
        req.params.productId,
        req.body.quantity
    );
    return res.status(200).json(
        new ApiResponse(200, "Cart updated", cart)
    );
});

const removeItem = asyncHandler(async (req, res) => {
    const cart = await cartService.removeItemFromCart(req.user.id, req.params.productId);
    return res.status(200).json(
        new ApiResponse(200, "Item removed from cart", cart)
    );
});

const clearCart = asyncHandler(async (req, res) => {
    const result = await cartService.clearCart(req.user.id);
    return res.status(200).json(
        new ApiResponse(200, "Cart cleared", result)
    );
});

export default {
    getCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
};
