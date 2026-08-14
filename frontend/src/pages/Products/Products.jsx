import { useEffect, useMemo, useState } from "react";
import {
    ChevronDown,
    Grid2X2,
    List,
    Search,
    SlidersHorizontal,
    Star,
    X,
} from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getProducts } from "@/services/product.service";
import { getCategories } from "@/services/category.service";

const API_BASE_URL = "http://localhost:5000";

const Products = () => {
    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();

    const categoryFromUrl =
        searchParams.get("category") || "";

    const [products, setProducts] =
        useState([]);

    const [categories, setCategories] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [category, setCategory] =
        useState(categoryFromUrl);

    const [sortBy, setSortBy] =
        useState("featured");

    const [minPrice, setMinPrice] =
        useState("");

    const [maxPrice, setMaxPrice] =
        useState("");

    const [viewMode, setViewMode] =
        useState("grid");

    const [showFilters, setShowFilters] =
        useState(false);

    const [currentPage, setCurrentPage] =
        useState(1);

    const productsPerPage = 8;

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        setCategory(categoryFromUrl);
    }, [categoryFromUrl]);

    const loadData = async () => {
        try {
            setLoading(true);

            const [
                productsResponse,
                categoriesResponse,
            ] = await Promise.all([
                getProducts(),
                getCategories(),
            ]);

            const productsData =
                productsResponse.data?.data || [];

            const categoriesData =
                categoriesResponse.data?.data || [];

            setProducts(
                Array.isArray(productsData)
                    ? productsData
                    : []
            );

            setCategories(
                Array.isArray(categoriesData)
                    ? categoriesData
                    : []
            );

        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load products"
            );

        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (image) => {
        if (!image) {
            return "";
        }

        if (image.startsWith("http")) {
            return image;
        }

        return `${API_BASE_URL}${image}`;
    };

    // --------------------------------------------
    // FILTER + SEARCH + SORT
    // --------------------------------------------

    const filteredProducts = useMemo(() => {
        let result = [...products];

        // SEARCH

        const searchValue =
            search.trim().toLowerCase();

        if (searchValue) {
            result = result.filter(
                (product) => {
                    const name =
                        product.name
                            ?.toLowerCase() || "";

                    const description =
                        product.description
                            ?.toLowerCase() || "";

                    const sku =
                        product.sku
                            ?.toLowerCase() || "";

                    return (
                        name.includes(
                            searchValue
                        ) ||
                        description.includes(
                            searchValue
                        ) ||
                        sku.includes(
                            searchValue
                        )
                    );
                }
            );
        }

        // CATEGORY

        if (category) {
            result = result.filter(
                (product) =>
                    product.category?._id ===
                    category
            );
        }

        // MIN PRICE

        if (minPrice !== "") {
            result = result.filter(
                (product) =>
                    Number(
                        product.salePrice ||
                        product.price ||
                        0
                    ) >=
                    Number(minPrice)
            );
        }

        // MAX PRICE

        if (maxPrice !== "") {
            result = result.filter(
                (product) =>
                    Number(
                        product.salePrice ||
                        product.price ||
                        0
                    ) <=
                    Number(maxPrice)
            );
        }

        // SORT

        switch (sortBy) {
            case "price-low":
                result.sort(
                    (a, b) =>
                        Number(
                            a.salePrice ||
                            a.price ||
                            0
                        ) -
                        Number(
                            b.salePrice ||
                            b.price ||
                            0
                        )
                );
                break;

            case "price-high":
                result.sort(
                    (a, b) =>
                        Number(
                            b.salePrice ||
                            b.price ||
                            0
                        ) -
                        Number(
                            a.salePrice ||
                            a.price ||
                            0
                        )
                );
                break;

            case "rating":
                result.sort(
                    (a, b) =>
                        Number(
                            b.rating || 0
                        ) -
                        Number(
                            a.rating || 0
                        )
                );
                break;

            case "newest":
                result.sort(
                    (a, b) =>
                        new Date(
                            b.createdAt
                        ) -
                        new Date(
                            a.createdAt
                        )
                );
                break;

            case "featured":
            default:
                result.sort(
                    (a, b) =>
                        Number(
                            b.isFeatured
                        ) -
                        Number(
                            a.isFeatured
                        )
                );
        }

        return result;
    }, [
        products,
        search,
        category,
        minPrice,
        maxPrice,
        sortBy,
    ]);

    // --------------------------------------------
    // PAGINATION
    // --------------------------------------------

    const totalPages = Math.ceil(
        filteredProducts.length /
        productsPerPage
    );

    const startIndex =
        (currentPage - 1) *
        productsPerPage;

    const paginatedProducts =
        filteredProducts.slice(
            startIndex,
            startIndex + productsPerPage
        );

    const handleSearch = (event) => {
        setSearch(
            event.target.value
        );

        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearch("");
        setCategory("");
        setMinPrice("");
        setMaxPrice("");
        setSortBy("featured");
        setCurrentPage(1);

        navigate("/products");
    };

    return (
        <div className="min-h-screen bg-gray-100">

            {/* PAGE HEADER */}

            <div className="border-b bg-white">

                <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">

                    <h1 className="text-3xl font-bold text-gray-900">
                        All Products
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Discover products you'll love
                    </p>

                </div>

            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">

                {/* SEARCH */}

                <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">

                    <div className="relative">

                        <Search
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={
                                handleSearch
                            }
                            placeholder="Search products by name, description or SKU..."
                            className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>

                </div>

                {/* MOBILE FILTER BUTTON */}

                <button
                    type="button"
                    onClick={() =>
                        setShowFilters(
                            !showFilters
                        )
                    }
                    className="mb-4 flex items-center gap-2 rounded-lg border bg-white px-4 py-3 font-medium lg:hidden"
                >
                    <SlidersHorizontal
                        size={18}
                    />

                    Filters

                </button>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">

                    {/* FILTER SIDEBAR */}

                    <aside
                        className={`rounded-xl bg-white p-5 shadow-sm ${
                            showFilters
                                ? "block"
                                : "hidden"
                        } lg:block`}
                    >

                        <div className="mb-6 flex items-center justify-between">

                            <h2 className="text-lg font-bold">
                                Filters
                            </h2>

                            <button
                                type="button"
                                onClick={
                                    clearFilters
                                }
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Clear All
                            </button>

                        </div>

                        {/* CATEGORY */}

                        <div className="mb-7">

                            <h3 className="mb-3 font-semibold">
                                Category
                            </h3>

                            <div className="space-y-2">

                                <label className="flex cursor-pointer items-center gap-3">

                                    <input
                                        type="radio"
                                        name="category"
                                        checked={
                                            category ===
                                            ""
                                        }
                                        onChange={() => {
                                            setCategory(
                                                ""
                                            );
                                            setCurrentPage(
                                                1
                                            );
                                        }}
                                    />

                                    <span>
                                        All Categories
                                    </span>

                                </label>

                                {categories.map(
                                    (
                                        item
                                    ) => (

                                        <label
                                            key={
                                                item._id
                                            }
                                            className="flex cursor-pointer items-center gap-3"
                                        >

                                            <input
                                                type="radio"
                                                name="category"
                                                checked={
                                                    category ===
                                                    item._id
                                                }
                                                onChange={() => {
                                                    setCategory(
                                                        item._id
                                                    );
                                                    setCurrentPage(
                                                        1
                                                    );
                                                }}
                                            />

                                            <span>
                                                {
                                                    item.name
                                                }
                                            </span>

                                        </label>

                                    )
                                )}

                            </div>

                        </div>

                        {/* PRICE */}

                        <div>

                            <h3 className="mb-3 font-semibold">
                                Price
                            </h3>

                            <div className="grid grid-cols-2 gap-3">

                                <input
                                    type="number"
                                    min="0"
                                    value={
                                        minPrice
                                    }
                                    onChange={(e) => {
                                        setMinPrice(
                                            e.target.value
                                        );
                                        setCurrentPage(
                                            1
                                        );
                                    }}
                                    placeholder="Min"
                                    className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
                                />

                                <input
                                    type="number"
                                    min="0"
                                    value={
                                        maxPrice
                                    }
                                    onChange={(e) => {
                                        setMaxPrice(
                                            e.target.value
                                        );
                                        setCurrentPage(
                                            1
                                        );
                                    }}
                                    placeholder="Max"
                                    className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
                                />

                            </div>

                        </div>

                    </aside>

                    {/* PRODUCTS */}

                    <main className="lg:col-span-3">

                        {/* TOOLBAR */}

                        <div className="mb-5 flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">

                            <p className="text-sm text-gray-600">

                                <span className="font-semibold text-gray-900">
                                    {
                                        filteredProducts.length
                                    }
                                </span>{" "}
                                products found

                            </p>

                            <div className="flex items-center gap-3">

                                {/* SORT */}

                                <div className="relative">

                                    <select
                                        value={
                                            sortBy
                                        }
                                        onChange={(e) => {
                                            setSortBy(
                                                e.target.value
                                            );
                                            setCurrentPage(
                                                1
                                            );
                                        }}
                                        className="appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-4 pr-10 text-sm outline-none focus:border-blue-500"
                                    >

                                        <option value="featured">
                                            Featured
                                        </option>

                                        <option value="newest">
                                            Newest
                                        </option>

                                        <option value="price-low">
                                            Price: Low to High
                                        </option>

                                        <option value="price-high">
                                            Price: High to Low
                                        </option>

                                        <option value="rating">
                                            Customer Rating
                                        </option>

                                    </select>

                                    <ChevronDown
                                        size={16}
                                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                                    />

                                </div>

                                {/* VIEW */}

                                <div className="hidden overflow-hidden rounded-lg border md:flex">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setViewMode(
                                                "grid"
                                            )
                                        }
                                        className={`p-2 ${
                                            viewMode ===
                                            "grid"
                                                ? "bg-gray-900 text-white"
                                                : "bg-white text-gray-500"
                                        }`}
                                    >
                                        <Grid2X2
                                            size={18}
                                        />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setViewMode(
                                                "list"
                                            )
                                        }
                                        className={`p-2 ${
                                            viewMode ===
                                            "list"
                                                ? "bg-gray-900 text-white"
                                                : "bg-white text-gray-500"
                                        }`}
                                    >
                                        <List
                                            size={18}
                                        />
                                    </button>

                                </div>

                            </div>

                        </div>

                        {/* ACTIVE FILTER */}

                        {(search ||
                            category ||
                            minPrice ||
                            maxPrice) && (

                            <div className="mb-5 flex flex-wrap items-center gap-2">

                                {search && (
                                    <span className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm shadow-sm">

                                        Search: {search}

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearch(
                                                    ""
                                                );
                                                setCurrentPage(
                                                    1
                                                );
                                            }}
                                        >
                                            <X
                                                size={14}
                                            />
                                        </button>

                                    </span>
                                )}

                                {category && (
                                    <span className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm shadow-sm">

                                        Category:{" "}
                                        {
                                            categories.find(
                                                (item) =>
                                                    item._id ===
                                                    category
                                            )?.name
                                        }

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCategory(
                                                    ""
                                                );
                                                setCurrentPage(
                                                    1
                                                );
                                            }}
                                        >
                                            <X
                                                size={14}
                                            />
                                        </button>

                                    </span>
                                )}

                            </div>

                        )}

                        {/* LOADING */}

                        {loading ? (

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

                                {[1, 2, 3, 4, 5, 6].map(
                                    (
                                        item
                                    ) => (

                                        <div
                                            key={
                                                item
                                            }
                                            className="h-96 animate-pulse rounded-xl bg-gray-200"
                                        />

                                    )
                                )}

                            </div>

                        ) : paginatedProducts.length ===
                          0 ? (

                            <div className="rounded-xl bg-white p-16 text-center shadow-sm">

                                <div className="mb-4 text-5xl">
                                    🔍
                                </div>

                                <h2 className="text-xl font-bold">
                                    No products found
                                </h2>

                                <p className="mt-2 text-gray-500">
                                    Try changing your
                                    search or filters.
                                </p>

                                <button
                                    type="button"
                                    onClick={
                                        clearFilters
                                    }
                                    className="mt-5 rounded-lg bg-[#FF9900] px-5 py-2.5 font-semibold"
                                >
                                    Clear Filters
                                </button>

                            </div>

                        ) : (

                            <div
                                className={
                                    viewMode ===
                                    "grid"
                                        ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
                                        : "space-y-4"
                                }
                            >

                                {paginatedProducts.map(
                                    (
                                        product
                                    ) => (

                                        <ProductCard
                                            key={
                                                product._id
                                            }
                                            product={
                                                product
                                            }
                                            viewMode={
                                                viewMode
                                            }
                                            getImageUrl={
                                                getImageUrl
                                            }
                                            navigate={
                                                navigate
                                            }
                                        />

                                    )
                                )}

                            </div>

                        )}

                        {/* PAGINATION */}

                        {!loading &&
                            totalPages > 1 && (

                                <div className="mt-8 flex items-center justify-center gap-2">

                                    <button
                                        type="button"
                                        disabled={
                                            currentPage ===
                                            1
                                        }
                                        onClick={() =>
                                            setCurrentPage(
                                                (page) =>
                                                    page -
                                                    1
                                            )
                                        }
                                        className="rounded-lg border bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Previous
                                    </button>

                                    {Array.from(
                                        {
                                            length:
                                                totalPages,
                                        },
                                        (
                                            _,
                                            index
                                        ) => {

                                            const page =
                                                index +
                                                1;

                                            return (
                                                <button
                                                    key={
                                                        page
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        setCurrentPage(
                                                            page
                                                        )
                                                    }
                                                    className={`rounded-lg px-4 py-2 text-sm ${
                                                        currentPage ===
                                                        page
                                                            ? "bg-gray-900 text-white"
                                                            : "border bg-white text-gray-700"
                                                    }`}
                                                >
                                                    {
                                                        page
                                                    }
                                                </button>
                                            );
                                        }
                                    )}

                                    <button
                                        type="button"
                                        disabled={
                                            currentPage ===
                                            totalPages
                                        }
                                        onClick={() =>
                                            setCurrentPage(
                                                (page) =>
                                                    page +
                                                    1
                                            )
                                        }
                                        className="rounded-lg border bg-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Next
                                    </button>

                                </div>

                            )}

                    </main>

                </div>

            </div>

        </div>
    );
};

const ProductCard = ({
    product,
    viewMode,
    getImageUrl,
    navigate,
}) => {
    const price =
        Number(
            product.salePrice ||
            product.price ||
            0
        );

    const originalPrice =
        Number(
            product.price || 0
        );

    const hasDiscount =
        product.salePrice &&
        Number(product.salePrice) <
            originalPrice;

    return (
        <div
            className={
                viewMode === "grid"
                    ? "group overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    : "flex overflow-hidden rounded-xl bg-white shadow-sm"
            }
        >

            {/* IMAGE */}

            <button
                type="button"
                onClick={() =>
                    navigate(
                        `/products/${product._id}`
                    )
                }
                className={
                    viewMode === "grid"
                        ? "block w-full"
                        : "w-52 shrink-0"
                }
            >

                <div
                    className={
                        viewMode === "grid"
                            ? "flex h-64 items-center justify-center bg-gray-50 p-5"
                            : "flex h-full min-h-52 items-center justify-center bg-gray-50 p-5"
                    }
                >

                    {product.thumbnail ? (

                        <img
                            src={getImageUrl(
                                product.thumbnail
                            )}
                            alt={
                                product.name
                            }
                            className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                        />

                    ) : (

                        <span className="text-5xl">
                            📦
                        </span>

                    )}

                </div>

            </button>

            {/* CONTENT */}

            <div
                className={
                    viewMode === "grid"
                        ? "p-5"
                        : "flex flex-1 flex-col justify-center p-6"
                }
            >

                <p className="text-xs font-semibold uppercase text-gray-500">
                    {
                        product.category
                            ?.name ||
                        "Product"
                    }
                </p>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/products/${product._id}`
                        )
                    }
                    className="mt-2 line-clamp-2 text-left font-semibold text-gray-900 hover:text-blue-600"
                >
                    {
                        product.name
                    }
                </button>

                <div className="mt-3 flex items-center gap-1">

                    <div className="flex text-yellow-500">

                        {[1, 2, 3, 4, 5].map(
                            (star) => (

                                <Star
                                    key={
                                        star
                                    }
                                    size={14}
                                    fill={
                                        star <=
                                        Math.round(
                                            product.rating ||
                                            0
                                        )
                                            ? "currentColor"
                                            : "none"
                                    }
                                />

                            )
                        )}

                    </div>

                    <span className="text-xs text-gray-500">
                        (
                        {
                            product.totalReviews ||
                            0
                        }
                        )
                    </span>

                </div>

                <div className="mt-3 flex items-center gap-2">

                    <span className="text-xl font-bold">
                        ₹
                        {price.toLocaleString(
                            "en-IN"
                        )}
                    </span>

                    {hasDiscount && (

                        <span className="text-sm text-gray-400 line-through">
                            ₹
                            {originalPrice.toLocaleString(
                                "en-IN"
                            )}
                        </span>

                    )}

                </div>

                {product.stock > 0 ? (

                    <p className="mt-2 text-sm font-medium text-green-600">
                        In stock
                    </p>

                ) : (

                    <p className="mt-2 text-sm font-medium text-red-600">
                        Out of stock
                    </p>

                )}

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/products/${product._id}`
                        )
                    }
                    className="mt-4 rounded-lg bg-[#FFD814] py-2.5 text-sm font-semibold hover:bg-[#F7CA00]"
                >
                    View Product
                </button>

            </div>

        </div>
    );
};

export default Products;