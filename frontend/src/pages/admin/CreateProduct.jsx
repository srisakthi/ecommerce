import { useEffect, useState } from "react";
import { ArrowLeft, ImagePlus, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
    createProduct,
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

const CreateProduct = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState(initialForm);

    const [categories, setCategories] = useState([]);

    const [loadingCategories, setLoadingCategories] = useState(true);

    const [saving, setSaving] = useState(false);

    const [uploading, setUploading] = useState(false);

    const [selectedImage, setSelectedImage] = useState(null);

    const [imagePreview, setImagePreview] = useState("");

    const [uploadedImagePath, setUploadedImagePath] = useState("");

    const [errors, setErrors] = useState({});

    // --------------------------------------------------
    // LOAD CATEGORIES
    // --------------------------------------------------

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoadingCategories(true);

                const response = await getCategories();

                const result = response.data?.data;

                if (Array.isArray(result)) {
                    setCategories(result);
                } else if (Array.isArray(result?.categories)) {
                    setCategories(result.categories);
                } else {
                    setCategories([]);
                }
            } catch (error) {
                console.error(
                    "Failed to load categories:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Failed to load categories"
                );
            } finally {
                setLoadingCategories(false);
            }
        };

        loadCategories();
    }, []);

    // --------------------------------------------------
    // INPUT CHANGE
    // --------------------------------------------------

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
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
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            return;
        }

        setSelectedImage(file);

        setUploadedImagePath("");

        const previewUrl = URL.createObjectURL(file);

        setImagePreview(previewUrl);
    };

    // --------------------------------------------------
    // REMOVE IMAGE
    // --------------------------------------------------

    const handleRemoveImage = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setSelectedImage(null);

        setImagePreview("");

        setUploadedImagePath("");
    };

    // --------------------------------------------------
    // UPLOAD IMAGE
    // --------------------------------------------------

    const handleUploadImage = async () => {
        if (!selectedImage) {
            toast.error("Please select an image first");
            return;
        }

        try {
            setUploading(true);

            const formData = new FormData();

            formData.append("image", selectedImage);

            const response =
                await uploadProductImage(formData);

            const imagePath =
                response.data?.path ||
                response.data?.data?.path;

            if (!imagePath) {
                throw new Error(
                    "Image path was not returned by server"
                );
            }

            setUploadedImagePath(imagePath);

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
            newErrors.name = "Product name is required";
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
            newErrors.sku = "SKU is required";
        }

        if (!formData.price) {
            newErrors.price = "Price is required";
        } else if (Number(formData.price) <= 0) {
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
            newErrors.stock = "Stock is required";
        } else if (Number(formData.stock) < 0) {
            newErrors.stock =
                "Stock cannot be negative";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // --------------------------------------------------
    // CREATE PRODUCT
    // --------------------------------------------------

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        /*
         * Image is optional for now.
         *
         * If the user selected an image but hasn't
         * uploaded it, don't allow product creation.
         */

        if (selectedImage && !uploadedImagePath) {
            toast.error(
                "Please upload the selected image before creating the product"
            );

            return;
        }

        try {
            setSaving(true);

            const payload = {
                name: formData.name.trim(),

                description:
                    formData.description.trim(),

                category: formData.category,

                sku: formData.sku.trim(),

                price: Number(formData.price),

                salePrice: formData.salePrice
                    ? Number(formData.salePrice)
                    : undefined,

                stock: Number(formData.stock),

                isFeatured: formData.isFeatured,

                status: formData.status,

                thumbnail:
                    uploadedImagePath || "",
            };

            await createProduct(payload);

            toast.success(
                "Product created successfully"
            );

            navigate("/admin/products");
        } catch (error) {
            console.error(
                "Create product error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to create product"
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 md:p-8">

            {/* -------------------------------------- */}
            {/* HEADER */}
            {/* -------------------------------------- */}

            <div className="mb-8 flex items-center gap-4">

                <button
                    type="button"
                    onClick={() =>
                        navigate("/admin/products")
                    }
                    className="rounded-lg border border-gray-300 bg-white p-2 text-gray-600 hover:bg-gray-50"
                >
                    <ArrowLeft size={20} />
                </button>

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Add Product
                    </h1>

                    <p className="mt-1 text-gray-500">
                        Create a new product for your store
                    </p>
                </div>

            </div>

            <form onSubmit={handleSubmit}>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* ---------------------------------- */}
                    {/* MAIN PRODUCT INFORMATION */}
                    {/* ---------------------------------- */}

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
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter product name"
                                    className={`w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 ${
                                        errors.name
                                            ? "border-red-400 focus:ring-red-100"
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
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="6"
                                    placeholder="Enter product description"
                                    className={`w-full resize-none rounded-lg border px-4 py-3 outline-none focus:ring-2 ${
                                        errors.description
                                            ? "border-red-400 focus:ring-red-100"
                                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                                    }`}
                                />

                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.description}
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
                                        value={formData.category}
                                        onChange={handleChange}
                                        disabled={
                                            loadingCategories
                                        }
                                        className={`w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 ${
                                            errors.category
                                                ? "border-red-400"
                                                : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                                        }`}
                                    >

                                        <option value="">
                                            {loadingCategories
                                                ? "Loading categories..."
                                                : "Select category"}
                                        </option>

                                        {categories.map(
                                            (category) => (
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
                                            {errors.category}
                                        </p>
                                    )}

                                </div>

                                <div>

                                    <label className="mb-2 block text-sm font-semibold">
                                        SKU
                                    </label>

                                    <input
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleChange}
                                        placeholder="SKU-12345"
                                        className={`w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 ${
                                            errors.sku
                                                ? "border-red-400 focus:ring-red-100"
                                                : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                                        }`}
                                    />

                                    {errors.sku && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.sku}
                                        </p>
                                    )}

                                </div>

                            </div>

                        </div>

                        {/* ---------------------------------- */}
                        {/* PRICING & INVENTORY */}
                        {/* ---------------------------------- */}

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
                                        name="price"
                                        min="0"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="99999"
                                        className={`w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 ${
                                            errors.price
                                                ? "border-red-400"
                                                : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                                        }`}
                                    />

                                    {errors.price && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.price}
                                        </p>
                                    )}

                                </div>

                                <div>

                                    <label className="mb-2 block text-sm font-semibold">
                                        Sale Price
                                    </label>

                                    <input
                                        type="number"
                                        name="salePrice"
                                        min="0"
                                        value={
                                            formData.salePrice
                                        }
                                        onChange={handleChange}
                                        placeholder="94999"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                    {errors.salePrice && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.salePrice}
                                        </p>
                                    )}

                                </div>

                                <div>

                                    <label className="mb-2 block text-sm font-semibold">
                                        Stock
                                    </label>

                                    <input
                                        type="number"
                                        name="stock"
                                        min="0"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        placeholder="100"
                                        className={`w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 ${
                                            errors.stock
                                                ? "border-red-400"
                                                : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                                        }`}
                                    />

                                    {errors.stock && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.stock}
                                        </p>
                                    )}

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* ---------------------------------- */}
                    {/* RIGHT SIDEBAR */}
                    {/* ---------------------------------- */}

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
                                            src={imagePreview}
                                            alt="Product preview"
                                            className="h-64 w-full rounded-lg object-contain"
                                        />

                                        <button
                                            type="button"
                                            onClick={
                                                handleRemoveImage
                                            }
                                            className="absolute right-2 top-2 rounded-full bg-red-600 p-2 text-white hover:bg-red-700"
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

                                        <span className="font-medium text-gray-700">
                                            Select product image
                                        </span>

                                        <span className="mt-1 text-xs text-gray-400">
                                            PNG, JPG, JPEG up to 5MB
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

                                    <p className="mb-3 truncate text-sm text-gray-600">
                                        {selectedImage.name}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={
                                            handleUploadImage
                                        }
                                        disabled={uploading}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 font-semibold text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >

                                        <Upload size={17} />

                                        {uploading
                                            ? "Uploading..."
                                            : uploadedImagePath
                                                ? "Image Uploaded"
                                                : "Upload Image"}

                                    </button>

                                </div>
                            )}

                        </div>

                        {/* STATUS */}

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
                                    value={formData.status}
                                    onChange={handleChange}
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

                            <label className="flex cursor-pointer items-center gap-3">

                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    checked={
                                        formData.isFeatured
                                    }
                                    onChange={handleChange}
                                    className="h-4 w-4"
                                />

                                <span className="text-sm font-medium">
                                    Featured Product
                                </span>

                            </label>

                        </div>

                    </div>

                </div>

                {/* ---------------------------------- */}
                {/* FORM ACTIONS */}
                {/* ---------------------------------- */}

                <div className="mt-6 flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin/products")
                        }
                        disabled={saving}
                        className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving || uploading}
                        className="rounded-lg bg-[#FF9900] px-6 py-3 font-semibold text-black hover:bg-[#e88a00] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving
                            ? "Creating Product..."
                            : "Create Product"}
                    </button>

                </div>

            </form>

        </div>
    );
};

export default CreateProduct;