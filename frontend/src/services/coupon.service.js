import api from "../api/axios";

export const applyCoupon = async (code, subtotal) => {
    return await api.post("/coupons/apply", { code, subtotal });
};

export const getCouponsAdmin = async () => {
    return await api.get("/coupons");
};

export const createCouponAdmin = async (data) => {
    return await api.post("/coupons", data);
};

export const deleteCouponAdmin = async (id) => {
    return await api.delete(`/coupons/${id}`);
};
