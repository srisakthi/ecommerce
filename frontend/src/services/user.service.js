import api from "../api/axios";

export const getProfile = async () => {
    return await api.get("/users/profile");
};

export const updateProfile = async (data) => {
    return await api.put("/users/profile", data);
};

export const getAllUsers = async () => {
    return await api.get("/users");
};

export const updateUserAdmin = async (id, data) => {
    return await api.put(`/users/${id}`, data);
};

export const deleteUserAdmin = async (id) => {
    return await api.delete(`/users/${id}`);
};

export const createUserAdmin = async (data) => {
    return await api.post("/users", data);
};
