import {
    ChevronLeft,
    ChevronRight,
    Minus,
    Plus,
    ShoppingCart,
    Star,
    Truck,
    ShieldCheck,
    RotateCcw,
    Check,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { addToCart } from "@/features/cart/cartSlice";

import { getProduct } from "@/services/product.service";

const API_BASE_URL = "http://localhost:5000";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [product, setProduct] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [quantity, setQuantity] =
        useState(1);

    const [selectedImage, setSelectedImage] =
        useState("");

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            setLoading(true);

            const response =
                await getProduct(id);

            const data =
                response.data?.data;

            setProduct(data);

            if (data?.thumbnail) {
                setSelectedImage(
                    data.thumbnail
                );
            } else if (
                data?.images?.length
            ) {
                setSelectedImage(
                    data.images[0]
                );
            }

        } catch (error) {
            console.error(
                "Failed to load product:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Product not found"
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

    const increaseQuantity = () => {
        if (
            product &&
            quantity < product.stock
        ) {
            setQuantity(
                (value) => value + 1
            );
        }
    };

    const decreaseQuantity = () => {
        setQuantity(
            (value) =>
                Math.max(1, value - 1)
        );
    };

    const handleAddToCart = () => {

        if (!product) {
            return;
        }
    
        dispatch(
            addToCart({
                productId: product._id,
    
                name: product.name,
    
                price: Number(
                    product.salePrice ||
                    product.price ||
                    0
                ),
    
                thumbnail:
                    product.thumbnail || "",
    
                quantity: quantity,
    
                stock: Number(
                    product.stock || 0
                ),
            })
        );
    
        toast.success(
            `${product.name} added to cart`
        );
    };

    const handleBuyNow = () => {
        /*
         * Checkout functionality will be
         * connected later.
         */
        toast.success(
            "Buy Now flow will be connected next"
        );
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">

                <div className="grid animate-pulse gap-10 lg:grid-cols-2">

                    <div className="h-[500px] rounded-xl bg-gray-200" />

                    <div className="space-y-5">

                        <div className="h-8 w-3/4 rounded bg-gray-200" />

                        <div className="h-5 w-1/3 rounded bg-gray-200" />

                        <div className="h-10 w-1/2 rounded bg-gray-200" />

                        <div className="h-24 w-full rounded bg-gray-200" />

                        <div className="h-12 w-full rounded bg-gray-200" />

                    </div>

                </div>

            </div>
        );
    }

    if (!product) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-20 text-center">

                <div className="text-6xl">
                    📦
                </div>

                <h1 className="mt-5 text-2xl font-bold">
                    Product not found
                </h1>

                <p className="mt-2 text-gray-500">
                    The product you're looking for
                    doesn't exist.
                </p>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/products"
                        )
                    }
                    className="mt-6 rounded-lg bg-[#FF9900] px-6 py-3 font-semibold"
                >
                    Back to Products
                </button>

            </div>
        );
    }

    const images = [
        ...(product.thumbnail
            ? [product.thumbnail]
            : []),
        ...(product.images || []),
    ].filter(Boolean);

    const uniqueImages = [
        ...new Set(images),
    ];

    const price = Number(
        product.salePrice ||
        product.price ||
        0
    );

    const originalPrice = Number(
        product.price || 0
    );

    const hasDiscount =
        product.salePrice &&
        originalPrice > price;

    const discountPercentage =
        hasDiscount
            ? Math.round(
                  ((originalPrice -
                      price) /
                      originalPrice) *
                      100
              )
            : 0;

    const isInStock =
        Number(product.stock || 0) > 0;

    return (
        <div className="min-h-screen bg-gray-100">

            {/* BREADCRUMB */}

            <div className="border-b bg-white">

                <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">

                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/")
                            }
                            className="hover:text-blue-600"
                        >
                            Home
                        </button>

                        <ChevronRight
                            size={15}
                        />

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/products"
                                )
                            }
                            className="hover:text-blue-600"
                        >
                            Products
                        </button>

                        <ChevronRight
                            size={15}
                        />

                        <span className="text-gray-900">
                            {product.name}
                        </span>

                    </div>

                </div>

            </div>

            {/* MAIN */}

            <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">

                <div className="grid gap-10 lg:grid-cols-2">

                    {/* =================================
                        LEFT - IMAGE GALLERY
                    ================================= */}

                    <div>

                        <div className="rounded-xl bg-white p-6 shadow-sm">

                            <div className="flex h-[450px] items-center justify-center">

                                {selectedImage ? (

                                    <img
                                        src={getImageUrl(
                                            selectedImage
                                        )}
                                        alt={
                                            product.name
                                        }
                                        className="h-full max-w-full object-contain"
                                    />

                                ) : (

                                    <div className="text-8xl">
                                        📦
                                    </div>

                                )}

                            </div>

                        </div>

                        {/* THUMBNAILS */}

                        {uniqueImages.length >
                            1 && (

                            <div className="mt-4 flex gap-3 overflow-x-auto">

                                {uniqueImages.map(
                                    (
                                        image,
                                        index
                                    ) => (

                                        <button
                                            key={`${image}-${index}`}
                                            type="button"
                                            onClick={() =>
                                                setSelectedImage(
                                                    image
                                                )
                                            }
                                            className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border-2 bg-white p-2 ${
                                                selectedImage ===
                                                image
                                                    ? "border-blue-600"
                                                    : "border-gray-200"
                                            }`}
                                        >

                                            <img
                                                src={getImageUrl(
                                                    image
                                                )}
                                                alt=""
                                                className="h-full w-full object-contain"
                                            />

                                        </button>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                    {/* =================================
                        RIGHT - PRODUCT INFORMATION
                    ================================= */}

                    <div>

                        {/* CATEGORY */}

                        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                            {
                                product.category
                                    ?.name ||
                                "Product"
                            }
                        </p>

                        {/* NAME */}

                        <h1 className="mt-2 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
                            {product.name}
                        </h1>

                        {/* RATING */}

                        <div className="mt-4 flex items-center gap-3">

                            <div className="flex items-center gap-1">

                                <div className="flex text-yellow-500">

                                    {[1, 2, 3, 4, 5].map(
                                        (star) => (

                                            <Star
                                                key={
                                                    star
                                                }
                                                size={18}
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

                                <span className="font-semibold text-gray-700">
                                    {
                                        product.rating ||
                                        0
                                    }
                                </span>

                            </div>

                            <span className="text-gray-400">
                                |
                            </span>

                            <span className="text-sm text-blue-600">
                                {
                                    product.totalReviews ||
                                    0
                                } reviews
                            </span>

                        </div>

                        <div className="my-6 border-t" />

                        {/* PRICE */}

                        <div>

                            {hasDiscount && (

                                <p className="text-sm text-gray-500">
                                    M.R.P.:{" "}
                                    <span className="line-through">
                                        ₹
                                        {originalPrice.toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>
                                </p>

                            )}

                            <div className="mt-1 flex items-center gap-3">

                                <span className="text-4xl font-bold text-gray-900">
                                    ₹
                                    {price.toLocaleString(
                                        "en-IN"
                                    )}
                                </span>

                                {hasDiscount && (

                                    <span className="rounded bg-red-100 px-2 py-1 text-sm font-bold text-red-600">
                                        {discountPercentage}%
                                        OFF
                                    </span>

                                )}

                            </div>

                            {hasDiscount && (

                                <p className="mt-1 text-sm text-gray-500">
                                    Inclusive of applicable
                                    taxes
                                </p>

                            )}

                        </div>

                        {/* DESCRIPTION */}

                        <div className="mt-6">

                            <h2 className="mb-2 text-lg font-bold">
                                About this product
                            </h2>

                            <p className="whitespace-pre-line leading-7 text-gray-600">
                                {
                                    product.description ||
                                    "No description available."
                                }
                            </p>

                        </div>

                        {/* STOCK */}

                        <div className="mt-6">

                            {isInStock ? (

                                <div className="flex items-center gap-2 font-semibold text-green-600">

                                    <Check
                                        size={18}
                                    />

                                    In Stock

                                </div>

                            ) : (

                                <p className="font-semibold text-red-600">
                                    Currently
                                    unavailable
                                </p>

                            )}

                            {isInStock && (
                                <p className="mt-1 text-sm text-gray-500">
                                    {product.stock}{" "}
                                    units available
                                </p>
                            )}

                        </div>

                        {/* QUANTITY */}

                        {isInStock && (

                            <div className="mt-6">

                                <label className="mb-2 block text-sm font-semibold">
                                    Quantity
                                </label>

                                <div className="flex w-fit items-center overflow-hidden rounded-lg border bg-white">

                                    <button
                                        type="button"
                                        onClick={
                                            decreaseQuantity
                                        }
                                        disabled={
                                            quantity <=
                                            1
                                        }
                                        className="p-3 hover:bg-gray-100 disabled:opacity-40"
                                    >
                                        <Minus
                                            size={18}
                                        />
                                    </button>

                                    <span className="min-w-12 border-x px-4 py-3 text-center font-semibold">
                                        {
                                            quantity
                                        }
                                    </span>

                                    <button
                                        type="button"
                                        onClick={
                                            increaseQuantity
                                        }
                                        disabled={
                                            quantity >=
                                            product.stock
                                        }
                                        className="p-3 hover:bg-gray-100 disabled:opacity-40"
                                    >
                                        <Plus
                                            size={18}
                                        />
                                    </button>

                                </div>

                            </div>

                        )}

                        {/* ACTIONS */}

                        {isInStock && (

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                                <button
                                    type="button"
                                    onClick={
                                        handleAddToCart
                                    }
                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#FFD814] px-6 py-3.5 font-bold text-gray-900 hover:bg-[#F7CA00]"
                                >
                                    <ShoppingCart
                                        size={20}
                                    />

                                    Add to Cart

                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleBuyNow
                                    }
                                    className="flex flex-1 items-center justify-center rounded-lg bg-[#FF9900] px-6 py-3.5 font-bold text-gray-900 hover:bg-[#e88a00]"
                                >
                                    Buy Now
                                </button>

                            </div>

                        )}

                        {/* BENEFITS */}

                        <div className="mt-8 grid grid-cols-1 gap-4 border-t pt-6 sm:grid-cols-3">

                            <div className="flex items-center gap-3">

                                <Truck
                                    size={24}
                                    className="text-gray-600"
                                />

                                <div>

                                    <p className="text-sm font-semibold">
                                        Fast Delivery
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Delivered to your
                                        doorstep
                                    </p>

                                </div>

                            </div>

                            <div className="flex items-center gap-3">

                                <ShieldCheck
                                    size={24}
                                    className="text-gray-600"
                                />

                                <div>

                                    <p className="text-sm font-semibold">
                                        Secure Payment
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        100% secure checkout
                                    </p>

                                </div>

                            </div>

                            <div className="flex items-center gap-3">

                                <RotateCcw
                                    size={24}
                                    className="text-gray-600"
                                />

                                <div>

                                    <p className="text-sm font-semibold">
                                        Easy Returns
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Hassle-free returns
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* =================================
                    PRODUCT INFORMATION
                ================================= */}

                <div className="mt-10 rounded-xl bg-white p-6 shadow-sm">

                    <h2 className="text-2xl font-bold">
                        Product Information
                    </h2>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        <div className="rounded-lg bg-gray-50 p-4">

                            <p className="text-xs uppercase text-gray-500">
                                SKU
                            </p>

                            <p className="mt-1 font-semibold">
                                {
                                    product.sku ||
                                    "N/A"
                                }
                            </p>

                        </div>

                        <div className="rounded-lg bg-gray-50 p-4">

                            <p className="text-xs uppercase text-gray-500">
                                Category
                            </p>

                            <p className="mt-1 font-semibold">
                                {
                                    product.category
                                        ?.name ||
                                    "N/A"
                                }
                            </p>

                        </div>

                        <div className="rounded-lg bg-gray-50 p-4">

                            <p className="text-xs uppercase text-gray-500">
                                Stock
                            </p>

                            <p className="mt-1 font-semibold">
                                {
                                    product.stock ??
                                    0
                                }
                            </p>

                        </div>

                        <div className="rounded-lg bg-gray-50 p-4">

                            <p className="text-xs uppercase text-gray-500">
                                Status
                            </p>

                            <p className="mt-1 font-semibold capitalize">
                                {
                                    product.status ||
                                    "Available"
                                }
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ProductDetails;