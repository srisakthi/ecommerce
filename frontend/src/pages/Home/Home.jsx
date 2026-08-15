import { useEffect, useState } from "react";
import {
    ArrowRight,
    ChevronRight,
    Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getProducts } from "@/services/product.service";
import { getCategories } from "@/services/category.service";
import { getProductImage, DEFAULT_PRODUCT_IMAGE } from "../../utils/image";


const Home = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loadingProducts, setLoadingProducts] =
        useState(true);

    const [loadingCategories, setLoadingCategories] =
        useState(true);

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const loadProducts = async () => {
        try {
            setLoadingProducts(true);

            const response =
                await getProducts();

            const data =
                response.data?.data;

            const productList = Array.isArray(data)
                ? data
                : (data?.products || []);

            setProducts(productList);


        } catch (error) {
            console.error(
                "Failed to load products:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to load products"
            );

        } finally {
            setLoadingProducts(false);
        }
    };

    const loadCategories = async () => {
        try {
            setLoadingCategories(true);

            const response =
                await getCategories();

            const data =
                response.data?.data || [];

            setCategories(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {
            console.error(
                "Failed to load categories:",
                error
            );

        } finally {
            setLoadingCategories(false);
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

    const featuredProducts =
        products.filter(
            (product) =>
                product.isFeatured
        );

    const displayProducts =
        featuredProducts.length > 0
            ? featuredProducts
            : products;

    return (
        <div className="min-h-screen bg-gray-100">

            {/* =========================================
                HERO
            ========================================= */}

            <section className="bg-[#131921]">

                <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:py-20">

                    <div className="grid items-center gap-10 lg:grid-cols-2">

                        <div className="text-white">

                            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#FF9900]">
                                Welcome to NexCart
                            </p>

                            <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                                Everything you need,
                                <span className="block text-[#FF9900]">
                                    all in one place.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-300">
                                Discover electronics,
                                fashion, home essentials
                                and more at great prices.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/products"
                                        )
                                    }
                                    className="inline-flex items-center gap-2 rounded-lg bg-[#FF9900] px-6 py-3 font-bold text-black transition hover:bg-[#e88a00]"
                                >
                                    Shop Now

                                    <ArrowRight
                                        size={18}
                                    />
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        document
                                            .getElementById(
                                                "categories"
                                            )
                                            ?.scrollIntoView({
                                                behavior:
                                                    "smooth",
                                            })
                                    }
                                    className="rounded-lg border border-white px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-black"
                                >
                                    Explore Categories
                                </button>

                            </div>

                        </div>

                        <div className="hidden lg:flex lg:justify-end">

                            <div className="relative h-80 w-80">

                                <div className="absolute inset-0 rounded-full bg-[#FF9900] opacity-20 blur-3xl" />

                                <div className="relative flex h-full items-center justify-center rounded-3xl border border-gray-700 bg-gray-800">

                                    <div className="text-center">

                                        <div className="text-7xl">
                                            🛒
                                        </div>

                                        <p className="mt-5 text-xl font-semibold text-white">
                                            Shop Smart
                                        </p>

                                        <p className="mt-2 text-gray-400">
                                            Shop with confidence
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* =========================================
                CATEGORIES
            ========================================= */}

            <section
                id="categories"
                className="mx-auto max-w-7xl px-4 py-10 md:px-6"
            >

                <div className="mb-6 flex items-center justify-between">

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Shop by Category
                        </h2>

                        <p className="mt-1 text-gray-500">
                            Find what you're looking for
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/products"
                            )
                        }
                        className="hidden items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 sm:flex"
                    >
                        View All

                        <ChevronRight
                            size={16}
                        />
                    </button>

                </div>

                {loadingCategories ? (

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

                        {[1, 2, 3, 4].map(
                            (item) => (
                                <div
                                    key={item}
                                    className="h-32 animate-pulse rounded-xl bg-gray-200"
                                />
                            )
                        )}

                    </div>

                ) : categories.length === 0 ? (

                    <div className="rounded-xl bg-white p-10 text-center shadow-sm">

                        <p className="text-gray-500">
                            No categories available.
                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

                        {categories
                            .slice(0, 8)
                            .map((category) => (

                                <button
                                    key={
                                        category._id
                                    }
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            `/products?category=${category._id}`
                                        )
                                    }
                                    className="group rounded-xl bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >

                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl transition group-hover:bg-[#FF9900]">
                                        🛍️
                                    </div>

                                    <h3 className="font-semibold text-gray-900">
                                        {
                                            category.name
                                        }
                                    </h3>

                                    <div className="mt-2 flex items-center text-sm text-gray-500">

                                        Shop now

                                        <ChevronRight
                                            size={15}
                                            className="ml-1 transition group-hover:translate-x-1"
                                        />

                                    </div>

                                </button>

                            ))}

                    </div>

                )}

            </section>

            {/* =========================================
                FEATURED PRODUCTS
            ========================================= */}

            <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6">

                <div className="mb-6 flex items-center justify-between">

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Featured Products
                        </h2>

                        <p className="mt-1 text-gray-500">
                            Top picks for you
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/products"
                            )
                        }
                        className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800"
                    >
                        View All

                        <ChevronRight
                            size={16}
                        />
                    </button>

                </div>

                {loadingProducts ? (

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                        {[1, 2, 3, 4].map(
                            (item) => (
                                <div
                                    key={item}
                                    className="h-96 animate-pulse rounded-xl bg-gray-200"
                                />
                            )
                        )}

                    </div>

                ) : displayProducts.length === 0 ? (

                    <div className="rounded-xl bg-white p-12 text-center shadow-sm">

                        <p className="text-gray-500">
                            No products available yet.
                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                        {displayProducts
                            .slice(0, 8)
                            .map((product) => (

                                <div
                                    key={
                                        product._id
                                    }
                                    className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                >

                                    {/* IMAGE */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                `/products/${product._id}`
                                            )
                                        }
                                        className="block w-full"
                                    >

                                        <div className="flex h-56 items-center justify-center bg-gray-50 p-5">
                                            <img
                                                src={getProductImage(product)}
                                                alt={product.name}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = DEFAULT_PRODUCT_IMAGE;
                                                }}
                                                className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                                            />
                                        </div>


                                    </button>

                                    {/* DETAILS */}

                                    <div className="p-5">

                                        <p className="mb-2 text-xs font-medium uppercase text-gray-500">
                                            {
                                                product
                                                    .category
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
                                            className="line-clamp-2 text-left font-semibold text-gray-900 hover:text-blue-600"
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
                                                            size={
                                                                14
                                                            }
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

                                        <div className="mt-4">

                                            {product.salePrice ? (

                                                <div className="flex items-center gap-2">

                                                    <span className="text-xl font-bold text-gray-900">
                                                        ₹
                                                        {Number(
                                                            product.salePrice
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </span>

                                                    <span className="text-sm text-gray-400 line-through">
                                                        ₹
                                                        {Number(
                                                            product.price
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </span>

                                                    <span className="ml-1 text-sm font-bold text-green-600">
                                                        {Math.round(((Number(product.price) - Number(product.salePrice)) / Number(product.price)) * 100)}% off
                                                    </span>

                                                </div>

                                            ) : (

                                                <span className="text-xl font-bold text-gray-900">
                                                    ₹
                                                    {Number(
                                                        product.price ||
                                                        0
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </span>

                                            )}

                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/products/${product._id}`
                                                )
                                            }
                                            className="mt-4 w-full rounded-lg bg-[#FFD814] py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-[#F7CA00]"
                                        >
                                            View Product
                                        </button>

                                    </div>

                                </div>

                            ))}

                    </div>

                )}

            </section>

            {/* =========================================
                PROMO
            ========================================= */}

            <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6">

                <div className="overflow-hidden rounded-2xl bg-[#232F3E] p-8 md:p-12">

                    <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">

                        <div>

                            <h2 className="text-2xl font-bold text-white md:text-3xl">
                                Great deals are waiting for you
                            </h2>

                            <p className="mt-2 text-gray-300">
                                Explore our complete product
                                collection and find your next
                                favorite product.
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/products"
                                )
                            }
                            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#FF9900] px-6 py-3 font-bold text-black hover:bg-[#e88a00]"
                        >
                            Browse Products

                            <ArrowRight
                                size={18}
                            />

                        </button>

                    </div>

                </div>

            </section>

        </div>
    );
};

export default Home;