import api from "../api/axios";

export const getLowStockProducts = async (query = "?threshold=10") => {
    return await api.get(`/inventory/low-stock${query}`);
};

export const updateStock = async (productId, stock) => {
    return await api.put(`/inventory/${productId}/stock`, { stock });
};
