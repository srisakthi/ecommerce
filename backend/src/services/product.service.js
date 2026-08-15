import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

import ApiError from "../utils/ApiError.js";

import categoryRepository from "../repositories/category.repository.js";
import productRepository from "../repositories/product.repository.js";

const createProduct = async (productData) => {
    const {
        name,
        description,
        category,
        price,
        salePrice,
        stock,
        thumbnail,
        images,
        isFeatured,
        status,
        seller,
    } = productData;

    if (!name || !category || !price) {
        throw new ApiError(400, "Name, Category and Price are required");
    }

    const categoryExists = await categoryRepository.findById(category);
    if (!categoryExists) {
        throw new ApiError(404, "Category not found");
    }

    const baseSlug = slugify(name, {
        lower: true,
        strict: true,
    });

    const uniqueSuffix = uuidv4().slice(0, 6);
    const slug = `${baseSlug}-${uniqueSuffix}`;

    const sku = `SKU-${uuidv4().slice(0, 8).toUpperCase()}`;

    return await productRepository.createProduct({
        name,
        slug,
        description,
        category,
        sku,
        price,
        salePrice,
        stock,
        thumbnail,
        images,
        isFeatured,
        status,
        seller,
    });
};

const getAllProducts = async (queryParams) => {
    return await productRepository.getAllProducts(queryParams);
};

const updateProduct = async (id, productData) => {
    const product = await productRepository.findById(id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if (productData.name && productData.name !== product.name) {
        const baseSlug = slugify(productData.name, {
            lower: true,
            strict: true,
        });
        const uniqueSuffix = uuidv4().slice(0, 6);
        productData.slug = `${baseSlug}-${uniqueSuffix}`;
    }

    return await productRepository.updateProduct(id, productData);
};

const deleteProduct = async (id) => {
    const product = await productRepository.findById(id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return await productRepository.deleteProduct(id);
};

const getProductById = async (id) => {
    return await productRepository.getProductById(id);
};

export default {
    createProduct,
    getAllProducts,
    updateProduct,
    getProductById,
    deleteProduct,
};