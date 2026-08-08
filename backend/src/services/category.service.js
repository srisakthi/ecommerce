import slugify from "slugify";

import ApiError from "../utils/ApiError.js";

import categoryRepository from "../repositories/category.repository.js";

const createCategory = async (categoryData) => {

    const {
        name,
        description,
        image,
        sortOrder
    } = categoryData;

    if (!name) {

        throw new ApiError(
            400,
            "Category name is required"
        );

    }

    const slug = slugify(name, {

        lower: true,

        strict: true

    });

    const existingCategory =
        await categoryRepository.findBySlug(slug);

    if (existingCategory) {

        throw new ApiError(
            409,
            "Category already exists"
        );

    }

    return await categoryRepository.createCategory({

        name,

        slug,

        description,

        image,

        sortOrder

    });

};

const getAllCategories = async () => {

    return await categoryRepository.getAllCategories();

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

    if (categoryData.name) {

        categoryData.slug =
            slugify(categoryData.name, {

                lower: true,

                strict: true

            });

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

    deleteCategory

};