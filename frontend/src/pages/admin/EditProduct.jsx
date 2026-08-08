import { useEffect, useState } from "react";
import {
    ArrowLeft,
    ImagePlus,
    Upload,
    X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import {
    getProducts,
    getProduct,
    updateProduct,
    uploadProductImage,
} from "../../services/product.service";

import { getCategories } from "../../services/category.service";

const initialForm = {
    name: "",
    description: "",
    category: "",
    sku: "",
    price: "",
    salePrice: "",
    stock: "",
    isFeatured: false,
    status: "published",
};

const EditProduct = () => {
    const navigate = useNavigate();

    const { id } = useParams();

    const [formData, setFormData] =
        useState(initialForm);

    const [categories, setCategories] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [uploading, setUploading] =
        useState(false);

    const [selectedImage, setSelectedImage] =
        useState(null);

    const [imagePreview, setImagePreview] =
        useState("");

    const [uploadedImagePath, setUploadedImagePath] =
        useState("");

    const [errors, setErrors] =
        useState({});

    // --------------------------------------------------
    // LOAD PRODUCT + CATEGORIES
    // --------------------------------------------------

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
    
                const [
                    productResponse,
                    categoriesResponse,
                ] = await Promise.all([
                    getProduct(id),
                    getCategories(),
                ]);
    
                const product =
                    productResponse.data?.data;
    
                const categoriesData =
                    categoriesResponse.data?.data;
    
                if (!product) {
                    toast.error("Product not found");
    
                    navigate("/admin/products");
    
                    return;
                }
    
                setFormData({
                    name: product.name || "",
                    description: product.description || "",
                    category:
                        product.category?._id ||
                        product.category ||
                        "",
                    sku: product.sku || "",
                    price: product.price ?? "",
                    salePrice: product.salePrice ?? "",
                    stock: product.stock ?? "",
                    isFeatured:
                        product.isFeatured || false,
                    status:
                        product.status || "published",
                });
    
                if (product.thumbnail) {
                    setImagePreview(
                        product.thumbnail
                    );
    
                    setUploadedImagePath(
                        product.thumbnail
                    );
                }
    
                if (Array.isArray(categoriesData)) {
                    setCategories(categoriesData);
                } else if (
                    Array.isArray(
                        categoriesData?.categories
                    )
                ) {
                    setCategories(
                        categoriesData.categories
                    );
                }
    
            } catch (error) {
                console.error(
                    "Failed to load edit data:",
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
    
        loadData();
    
    }, [id, navigate]);

    // --------------------------------------------------
    // INPUT CHANGE
    // --------------------------------------------------

    const handleChange = (event) => {
        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setFormData((previous) => ({
            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));

        setErrors((previous) => ({
            ...previous,

            [name]: "",
        }));
    };

    // --------------------------------------------------
    // IMAGE SELECT
    // --------------------------------------------------

    const handleImageSelect = (event) => {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            toast.error(
                "Please select an image file"
            );

            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error(
                "Image size must be less than 5MB"
            );

            return;
        }

        setSelectedImage(file);

        const previewUrl =
            URL.createObjectURL(file);

        setImagePreview(previewUrl);

        /*
         * Important:
         * The old uploaded path is cleared.
         * The new image must be uploaded first.
         */

        setUploadedImagePath("");
    };

    // --------------------------------------------------
    // REMOVE IMAGE
    // --------------------------------------------------

    const handleRemoveImage = () => {
        setSelectedImage(null);

        setImagePreview("");

        setUploadedImagePath("");
    };

    // --------------------------------------------------
    // UPLOAD IMAGE
    // --------------------------------------------------

    const handleUploadImage = async () => {
        if (!selectedImage) {
            toast.error(
                "Please select an image first"
            );

            return;
        }

        try {
            setUploading(true);

            const formData =
                new FormData();

            formData.append(
                "image",
                selectedImage
            );

            const response =
                await uploadProductImage(
                    formData
                );

            const imagePath =
                response.data?.path ||
                response.data?.data?.path;

            if (!imagePath) {
                throw new Error(
                    "Image path was not returned by server"
                );
            }

            setUploadedImagePath(
                imagePath
            );

            toast.success(
                "Product image uploaded successfully"
            );

        } catch (error) {
            console.error(
                "Image upload error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Image upload failed"
            );

        } finally {
            setUploading(false);
        }
    };

    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name =
                "Product name is required";
        }

        if (!formData.description.trim()) {
            newErrors.description =
                "Product description is required";
        }

        if (!formData.category) {
            newErrors.category =
                "Please select a category";
        }

        if (!formData.sku.trim()) {
            newErrors.sku =
                "SKU is required";
        }

        if (!formData.price) {
            newErrors.price =
                "Price is required";
        } else if (
            Number(formData.price) <= 0
        ) {
            newErrors.price =
                "Price must be greater than 0";
        }

        if (
            formData.salePrice &&
            Number(formData.salePrice) < 0
        ) {
            newErrors.salePrice =
                "Sale price cannot be negative";
        }

        if (formData.stock === "") {
            newErrors.stock =
                "Stock is required";
        } else if (
            Number(formData.stock) < 0
        ) {
            newErrors.stock =
                "Stock cannot be negative";
        }

        setErrors(newErrors);

        return (
            Object.keys(newErrors)
                .length === 0
        );
    };

    // --------------------------------------------------
    // UPDATE PRODUCT
    // --------------------------------------------------

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        /*
         * If a NEW image was selected,
         * it must be uploaded first.
         */

        if (
            selectedImage &&
            !uploadedImagePath
        ) {
            toast.error(
                "Please upload the selected image before updating the product"
            );

            return;
        }

        try {
            setSaving(true);

            const payload = {
                name:
                    formData.name.trim(),

                description:
                    formData.description.trim(),

                category:
                    formData.category,

                sku:
                    formData.sku.trim(),

                price:
                    Number(formData.price),

                salePrice:
                    formData.salePrice
                        ? Number(
                            formData.salePrice
                        )
                        : undefined,

                stock:
                    Number(formData.stock),

                isFeatured:
                    formData.isFeatured,

                status:
                    formData.status,

                thumbnail:
                    uploadedImagePath ||
                    "",
            };

            await updateProduct(
                id,
                payload
            );

            toast.success(
                "Product updated successfully"
            );

            navigate(
                "/admin/products"
            );

        } catch (error) {
            console.error(
                "Update product error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to update product"
            );

        } finally {
            setSaving(false);
        }
    };

    // --------------------------------------------------
    // LOADING
    // --------------------------------------------------

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <p className="text-gray-500">
                    Loading product...
                </p>
            </div>
        );
    }

    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (
        <div className="min-h-screen bg-gray-100 p-6 md:p-8">

            {/* HEADER */}

            <div className="mb-8 flex items-center gap-4">

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
                        Edit Product
                    </h1>

                    <p className="mt-1 text-gray-500">
                        Update product information
                    </p>
                </div>

            </div>

            <form onSubmit={handleSubmit}>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* MAIN */}

                    <div className="space-y-6 lg:col-span-2">

                        <div className="rounded-xl bg-white p-6 shadow-sm">

                            <h2 className="mb-6 text-xl font-semibold">
                                Product Information
                            </h2>

                            {/* NAME */}

                            <div className="mb-5">

                                <label className="mb-2 block text-sm font-semibold">
                                    Product Name
                                </label>

                                <input
                                    name="name"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className={`w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 ${
                                        errors.name
                                            ? "border-red-400"
                                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                                    }`}
                                />

                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}

                            </div>

                            {/* DESCRIPTION */}

                            <div className="mb-5">

                                <label className="mb-2 block text-sm font-semibold">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    rows="6"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className={`w-full resize-none rounded-lg border px-4 py-3 outline-none focus:ring-2 ${
                                        errors.description
                                            ? "border-red-400"
                                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                                    }`}
                                />

                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {
                                            errors.description
                                        }
                                    </p>
                                )}

                            </div>

                            {/* CATEGORY + SKU */}

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                <div>

                                    <label className="mb-2 block text-sm font-semibold">
                                        Category
                                    </label>

                                    <select
                                        name="category"
                                        value={
                                            formData.category
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >

                                        <option value="">
                                            Select category
                                        </option>

                                        {categories.map(
                                            (
                                                category
                                            ) => (
                                                <option
                                                    key={
                                                        category._id
                                                    }
                                                    value={
                                                        category._id
                                                    }
                                                >
                                                    {
                                                        category.name
                                                    }
                                                </option>
                                            )
                                        )}

                                    </select>

                                    {errors.category && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {
                                                errors.category
                                            }
                                        </p>
                                    )}

                                </div>

                                <div>

                                    <label className="mb-2 block text-sm font-semibold">
                                        SKU
                                    </label>

                                    <input
                                        name="sku"
                                        value={
                                            formData.sku
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                    {errors.sku && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {
                                                errors.sku
                                            }
                                        </p>
                                    )}

                                </div>

                            </div>

                        </div>

                        {/* PRICING */}

                        <div className="rounded-xl bg-white p-6 shadow-sm">

                            <h2 className="mb-6 text-xl font-semibold">
                                Pricing & Inventory
                            </h2>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                                <div>

                                    <label className="mb-2 block text-sm font-semibold">
                                        Price
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        name="price"
                                        value={
                                            formData.price
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                    {errors.price && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {
                                                errors.price
                                            }
                                        </p>
                                    )}

                                </div>

                                <div>

                                    <label className="mb-2 block text-sm font-semibold">
                                        Sale Price
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        name="salePrice"
                                        value={
                                            formData.salePrice
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                </div>

                                <div>

                                    <label className="mb-2 block text-sm font-semibold">
                                        Stock
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        name="stock"
                                        value={
                                            formData.stock
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* RIGHT */}

                    <div className="space-y-6">

                        {/* IMAGE */}

                        <div className="rounded-xl bg-white p-6 shadow-sm">

                            <h2 className="mb-5 text-xl font-semibold">
                                Product Image
                            </h2>

                            <div className="rounded-xl border-2 border-dashed border-gray-300 p-4">

                                {imagePreview ? (

                                    <div className="relative">

                                        <img
                                            src={
                                                imagePreview
                                            }
                                            alt={
                                                formData.name
                                            }
                                            className="h-64 w-full rounded-lg object-contain"
                                        />

                                        <button
                                            type="button"
                                            onClick={
                                                handleRemoveImage
                                            }
                                            className="absolute right-2 top-2 rounded-full bg-red-600 p-2 text-white"
                                        >
                                            <X size={16} />
                                        </button>

                                    </div>

                                ) : (

                                    <label className="flex cursor-pointer flex-col items-center justify-center py-12">

                                        <ImagePlus
                                            size={40}
                                            className="mb-3 text-gray-400"
                                        />

                                        <span className="font-medium">
                                            Select new image
                                        </span>

                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={
                                                handleImageSelect
                                            }
                                            className="hidden"
                                        />

                                    </label>

                                )}

                            </div>

                            {selectedImage && (
                                <div className="mt-4">

                                    <p className="mb-3 truncate text-sm text-gray-500">
                                        {
                                            selectedImage.name
                                        }
                                    </p>

                                    <button
                                        type="button"
                                        onClick={
                                            handleUploadImage
                                        }
                                        disabled={
                                            uploading
                                        }
                                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 font-semibold text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                                    >

                                        <Upload
                                            size={17}
                                        />

                                        {uploading
                                            ? "Uploading..."
                                            : uploadedImagePath
                                                ? "Image Uploaded"
                                                : "Upload New Image"}

                                    </button>

                                </div>
                            )}

                        </div>

                        {/* SETTINGS */}

                        <div className="rounded-xl bg-white p-6 shadow-sm">

                            <h2 className="mb-5 text-xl font-semibold">
                                Product Settings
                            </h2>

                            <div className="mb-5">

                                <label className="mb-2 block text-sm font-semibold">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={
                                        formData.status
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >

                                    <option value="published">
                                        Published
                                    </option>

                                    <option value="draft">
                                        Draft
                                    </option>

                                    <option value="archived">
                                        Archived
                                    </option>

                                </select>

                            </div>

                            <label className="flex items-center gap-3">

                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    checked={
                                        formData.isFeatured
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="h-4 w-4"
                                />

                                <span className="text-sm font-medium">
                                    Featured Product
                                </span>

                            </label>

                        </div>

                    </div>

                </div>

                {/* ACTIONS */}

                <div className="mt-6 flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/products"
                            )
                        }
                        disabled={saving}
                        className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={
                            saving ||
                            uploading
                        }
                        className="rounded-lg bg-[#FF9900] px-6 py-3 font-semibold text-black hover:bg-[#e88a00] disabled:opacity-60"
                    >
                        {saving
                            ? "Updating Product..."
                            : "Update Product"}
                    </button>

                </div>

            </form>

        </div>
    );
};

export default EditProduct;