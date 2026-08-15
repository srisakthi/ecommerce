import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";

const getCart = async (userId) => {
    let cart = await Cart.findOne({ user: userId }).populate("items.product", "name price salePrice thumbnail stock slug");
    if (!cart) {
        cart = await Cart.create({ user: userId, items: [], subtotal: 0 });
    }
    return cart;
};

const addItemToCart = async (userId, { productId, quantity = 1 }) => {
    const product = await Product.findOne({ _id: productId, isDeleted: false });
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if (product.stock < quantity) {
        throw new ApiError(400, "Insufficient stock available");
    }

    const price = product.salePrice || product.price;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = new Cart({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
    if (itemIndex > -1) {
        const newQty = cart.items[itemIndex].quantity + quantity;
        if (product.stock < newQty) {
            throw new ApiError(400, "Cannot add more than available stock");
        }
        cart.items[itemIndex].quantity = newQty;
        cart.items[itemIndex].price = price;
    } else {
        cart.items.push({ product: productId, quantity, price });
    }

    cart.subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    await cart.save();

    return getCart(userId);
};

const updateItemQuantity = async (userId, productId, quantity) => {
    if (quantity < 1) {
        return removeItemFromCart(userId, productId);
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if (product.stock < quantity) {
        throw new ApiError(400, "Insufficient stock available");
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
    if (itemIndex === -1) {
        throw new ApiError(404, "Item not found in cart");
    }

    const price = product.salePrice || product.price;
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = price;

    cart.subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    await cart.save();

    return getCart(userId);
};

const removeItemFromCart = async (userId, productId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    cart.subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    await cart.save();

    return getCart(userId);
};

const clearCart = async (userId) => {
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
        cart.items = [];
        cart.subtotal = 0;
        await cart.save();
    }
    return { items: [], subtotal: 0 };
};

export default {
    getCart,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    clearCart,
};
