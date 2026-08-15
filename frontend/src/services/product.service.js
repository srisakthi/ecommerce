import api from "@/api/axios";

// --------------------------------------------------
// GET ALL PRODUCTS
// --------------------------------------------------

export const getProducts = (query = "") =>
    api.get(`/products${query}`);


// --------------------------------------------------
// GET SINGLE PRODUCT
// --------------------------------------------------

export const getProduct = (id) =>
    api.get(`/products/${id}`);


// --------------------------------------------------
// CREATE PRODUCT
// --------------------------------------------------

export const createProduct = (data) =>
    api.post("/products", data);


// --------------------------------------------------
// UPDATE PRODUCT
// --------------------------------------------------

export const updateProduct = (id, data) =>
    api.put(`/products/${id}`, data);


// --------------------------------------------------
// DELETE PRODUCT
// --------------------------------------------------

export const deleteProduct = (id) =>
    api.delete(`/products/${id}`);


// --------------------------------------------------
// UPLOAD PRODUCT IMAGE
// --------------------------------------------------

export const uploadProductImage = (formData) =>
    api.post(
        "/products/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );