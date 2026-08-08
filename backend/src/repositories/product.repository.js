import Product from "../models/product.model.js";

const createProduct = async (productData) => {
    return await Product.create(productData);
};

const findBySlug = async (slug) => {
    return await Product.findOne({ slug, isDeleted: false });
};

const findById = async (id) => {
    return await Product.findById(id);
};

const getAllProducts = async () => {
    return await Product.find({ isDeleted: false })
        .populate("category", "name slug")
        .sort({ createdAt: -1 });
};

const updateProduct = async (id, data) => {
    return await Product.findByIdAndUpdate(
        id,
        data,
        { new: true }
    );
};

const getProductById = async (id) => {

    return await Product.findById(id)
        .populate("category");

};

const deleteProduct = async (id) => {
    return await Product.findByIdAndUpdate(
        id,
        {
            isDeleted: true
        },
        {
            new: true
        }
    );
};

export default {
    createProduct,
    findBySlug,
    findById,
    getAllProducts,
    updateProduct,
    getProductById,
    deleteProduct
};