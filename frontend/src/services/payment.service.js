import api from "@/api/axios";

export const createPaymentIntent = (orderId) => {
    return api.post("/payments/intent", { orderId });
};

export const verifyPayment = (paymentData) => {
    return api.post("/payments/verify", paymentData);
};
