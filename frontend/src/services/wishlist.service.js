import api from "../api/axios";

export const getWishlist = async () => {
    return await api.get("/wishlist");
};

export const addToWishlist = async (productId) => {
    return await api.post(`/wishlist/${productId}`);
};

export const removeFromWishlist = async (productId) => {
    return await api.delete(`/wishlist/${productId}`);
};
