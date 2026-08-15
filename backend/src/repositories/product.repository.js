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

const getAllProducts = async (queryParams = {}) => {
    const {
        search,
        category,
        minPrice,
        maxPrice,
        rating,
        sort = "newest",
        page = 1,
        limit = 50,
        seller,
    } = queryParams;

    const filter = { isDeleted: false };

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }

    if (category) {
        filter.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        filter.price = {};
        if (minPrice !== undefined && minPrice !== "") filter.price.$gte = Number(minPrice);
        if (maxPrice !== undefined && maxPrice !== "") filter.price.$lte = Number(maxPrice);
    }

    if (seller) {
        filter.seller = seller;
    }

    if (rating !== undefined && rating !== "") {
        filter.rating = { $gte: Number(rating) };
    }

    let sortOptions = { createdAt: -1 };
    if (sort === "price-low") sortOptions = { price: 1 };
    else if (sort === "price-high") sortOptions = { price: -1 };
    else if (sort === "rating") sortOptions = { rating: -1 };
    else if (sort === "popular") sortOptions = { totalReviews: -1 };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
        Product.find(filter)
            .populate("category", "name slug")
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum),
        Product.countDocuments(filter),
    ]);

    return {
        products,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
    };
};

const updateProduct = async (id, data) => {
    return await Product.findByIdAndUpdate(id, data, { new: true });
};

const getProductById = async (id) => {
    return await Product.findById(id).populate("category");
};

const deleteProduct = async (id) => {
    return await Product.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

export default {
    createProduct,
    findBySlug,
    findById,
    getAllProducts,
    updateProduct,
    getProductById,
    deleteProduct,
};