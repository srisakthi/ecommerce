import api from "@/api/axios";

export const createOrder = (data) =>
    api.post("/orders", data);

export const getMyOrders = () =>
    api.get("/orders/my-orders");

export const getMyOrderById = (id) =>
    api.get(`/orders/my-orders/${id}`);

export const getAllOrders = () =>
    api.get("/orders");

export const updateOrderStatus = (id, status) =>
    api.put(`/orders/${id}/status`, { status });