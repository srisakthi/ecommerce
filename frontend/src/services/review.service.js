import api from "../api/axios";

export const getProductReviews = async (productId) => {
    return await api.get(`/reviews/product/${productId}`);
};

export const createReview = async (data) => {
    return await api.post("/reviews", data);
};

export const getAllReviewsAdmin = async () => {
    return await api.get("/reviews/admin");
};

export const deleteReview = async (id) => {
    return await api.delete(`/reviews/${id}`);
};
