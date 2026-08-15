import Wishlist from "../models/wishlist.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";

const getWishlist = async (userId) => {
    let wishlist = await Wishlist.findOne({ user: userId }).populate("products", "name price salePrice thumbnail rating totalReviews stock slug");
    if (!wishlist) {
        wishlist = await Wishlist.create({ user: userId, products: [] });
    }
    return wishlist;
};

const addToWishlist = async (userId, productId) => {
    const product = await Product.findOne({ _id: productId, isDeleted: false });
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
        wishlist = new Wishlist({ user: userId, products: [] });
    }

    if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
        await wishlist.save();
    }

    return getWishlist(userId);
};

const removeFromWishlist = async (userId, productId) => {
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
        throw new ApiError(404, "Wishlist not found");
    }

    wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
    await wishlist.save();

    return getWishlist(userId);
};

export default {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
};
