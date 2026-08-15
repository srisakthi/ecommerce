import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

import ApiError from "../utils/ApiError.js";

import categoryRepository from "../repositories/category.repository.js";

const createCategory = async (categoryData) => {

    const {
        name,
        description,
        image,
        sortOrder,
        seller
    } = categoryData;

    if (!name) {

        throw new ApiError(
            400,
            "Category name is required"
        );

    }

    const baseSlug = slugify(name, {
        lower: true,
        strict: true
    });

    const uniqueSuffix = uuidv4().slice(0, 6);
    const slug = `${baseSlug}-${uniqueSuffix}`;

    return await categoryRepository.createCategory({

        name,

        slug,

        description,

        image,

        sortOrder,
        
        seller

    });

};

const getAllCategories = async (query = {}) => {
    let filter = {};
    if (query.seller) filter.seller = query.seller;
    return await categoryRepository.getAllCategories(filter);
};

const getCategoryById = async (id) => {
    return await categoryRepository.findById(id);
};

const getCategoryBySlug = async (slug) => {

    const category =
        await categoryRepository.findBySlug(slug);

    if (!category) {

        throw new ApiError(
            404,
            "Category not found"
        );

    }

    return category;

};

const updateCategory = async (
    id,
    categoryData
) => {

    const category =
        await categoryRepository.findById(id);

    if (!category) {

        throw new ApiError(
            404,
            "Category not found"
        );

    }

    if (categoryData.name && categoryData.name !== category.name) {
        const baseSlug = slugify(categoryData.name, {
            lower: true,
            strict: true
        });
        const uniqueSuffix = uuidv4().slice(0, 6);
        categoryData.slug = `${baseSlug}-${uniqueSuffix}`;
    }

    return await categoryRepository.updateCategory(

        id,

        categoryData

    );

};

const deleteCategory = async (id) => {

    const category =
        await categoryRepository.findById(id);

    if (!category) {

        throw new ApiError(
            404,
            "Category not found"
        );

    }

    await categoryRepository.deleteCategory(id);

};

export default {

    createCategory,

    getAllCategories,

    getCategoryBySlug,

    updateCategory,

    deleteCategory,
    getCategoryById

};