import api from "../api/axios";

export const getAddresses = async () => {
    return await api.get("/addresses");
};

export const createAddress = async (data) => {
    return await api.post("/addresses", data);
};

export const updateAddress = async (id, data) => {
    return await api.put(`/addresses/${id}`, data);
};

export const deleteAddress = async (id) => {
    return await api.delete(`/addresses/${id}`);
};
