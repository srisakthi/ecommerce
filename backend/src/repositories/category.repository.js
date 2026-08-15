import Category from "../models/category.model.js";

const createCategory = async (categoryData) => {
    return await Category.create(categoryData);
};

const findBySlug = async (slug) => {
    return await Category.findOne({ slug });
};

const findById = async (id) => {
    return await Category.findById(id);
};

const getAllCategories = async (filter = {}) => {
    return await Category.find(filter).sort({
        sortOrder: 1,
        createdAt: -1
    });
};

const updateCategory = async (id, data) => {
    return await Category.findByIdAndUpdate(
        id,
        data,
        {
            new: true
        }
    );
};

const deleteCategory = async (id) => {
    return await Category.findByIdAndDelete(id);
};

export default {
    createCategory,
    findBySlug,
    findById,
    getAllCategories,
    updateCategory,
    deleteCategory
};