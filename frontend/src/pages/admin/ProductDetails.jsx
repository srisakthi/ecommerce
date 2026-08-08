import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Pencil,
    Star,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getProduct } from "../../services/product.service";

const ProductDetails = () => {
    const navigate = useNavigate();

    const { id } = useParams();

    const [product, setProduct] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);

                const response =
                    await getProduct(id);

                setProduct(
                    response.data?.data
                );

            } catch (error) {
                console.error(
                    "Failed to load product:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Failed to load product"
                );

                navigate("/admin/products");

            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [id, navigate]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
            }
        ).format(price || 0);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <p className="text-gray-500">
                    Loading product...
                </p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <p className="text-gray-500">
                    Product not found
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 md:p-8">

            {/* HEADER */}

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-4">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/products"
                            )
                        }
                        className="rounded-lg border border-gray-300 bg-white p-2 text-gray-600 hover:bg-gray-50"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div>

                        <h1 className="text-3xl font-bold text-gray-900">
                            Product Details
                        </h1>

                        <p className="mt-1 text-gray-500">
                            View product information
                        </p>

                    </div>

                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/admin/products/${product._id}/edit`
                        )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF9900] px-5 py-3 font-semibold text-black hover:bg-[#e88a00]"
                >
                    <Pencil size={17} />

                    Edit Product
                </button>

            </div>

            {/* PRODUCT */}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* IMAGE */}

                <div className="rounded-xl bg-white p-6 shadow-sm">

                    <div className="flex min-h-[400px] items-center justify-center rounded-xl bg-gray-50">

                        {product.thumbnail ? (
                            <img
                                src={product.thumbnail}
                                alt={product.name}
                                className="max-h-[380px] w-full object-contain"
                            />
                        ) : (
                            <div className="text-gray-400">
                                No Image
                            </div>
                        )}

                    </div>

                </div>

                {/* INFORMATION */}

                <div className="space-y-6 lg:col-span-2">

                    <div className="rounded-xl bg-white p-6 shadow-sm">

                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                            <div>

                                <h2 className="text-2xl font-bold text-gray-900">
                                    {product.name}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {product.slug}
                                </p>

                            </div>

                            <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-sm font-semibold capitalize text-green-700">
                                {product.status}
                            </span>

                        </div>

                        <div className="mb-6">

                            <h3 className="mb-2 text-sm font-semibold text-gray-500">
                                Description
                            </h3>

                            <p className="leading-7 text-gray-700">
                                {product.description ||
                                    "No description available."}
                            </p>

                        </div>

                        {/* DETAILS GRID */}

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                            <div>
                                <p className="text-sm text-gray-500">
                                    SKU
                                </p>

                                <p className="mt-1 font-semibold">
                                    {product.sku || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Category
                                </p>

                                <p className="mt-1 font-semibold">
                                    {product.category?.name ||
                                        "Uncategorized"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Price
                                </p>

                                <p className="mt-1 text-xl font-bold">
                                    {formatPrice(
                                        product.price
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Sale Price
                                </p>

                                <p className="mt-1 text-xl font-bold text-green-600">
                                    {product.salePrice
                                        ? formatPrice(
                                            product.salePrice
                                        )
                                        : "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Stock
                                </p>

                                <p
                                    className={`mt-1 font-bold ${
                                        product.stock === 0
                                            ? "text-red-600"
                                            : product.stock < 10
                                                ? "text-orange-600"
                                                : "text-gray-900"
                                    }`}
                                >
                                    {product.stock}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Featured
                                </p>

                                <p className="mt-1 font-semibold">
                                    {product.isFeatured
                                        ? "Yes"
                                        : "No"}
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* RATING */}

                    <div className="rounded-xl bg-white p-6 shadow-sm">

                        <h3 className="mb-4 text-lg font-semibold">
                            Ratings & Reviews
                        </h3>

                        <div className="flex items-center gap-3">

                            <div className="flex items-center gap-1 text-yellow-500">

                                <Star
                                    size={20}
                                    fill="currentColor"
                                />

                                <span className="font-bold text-gray-900">
                                    {product.rating || 0}
                                </span>

                            </div>

                            <span className="text-gray-500">
                                {product.totalReviews || 0} reviews
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ProductDetails;