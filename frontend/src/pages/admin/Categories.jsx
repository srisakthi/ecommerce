import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../../services/category.service";

const emptyForm = {
    name: "",
    description: "",
};

const Categories = () => {
    const user = useSelector((state) => state.auth.user);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [deletingId, setDeletingId] = useState(null);

    const [search, setSearch] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [editingCategory, setEditingCategory] = useState(null);

    const [formData, setFormData] = useState(emptyForm);

    const [errors, setErrors] = useState({});

    // --------------------------------------------------
    // GET ALL CATEGORIES
    // --------------------------------------------------

    const loadCategories = async () => {
        try {
            setLoading(true);

            let query = "";
            if (user?.role === "seller") {
                query = `?seller=${user._id || user.id}`;
            }
            const response = await getCategories(query);

            const result = response.data?.data;

            /*
             * Supports either:
             *
             * data: [...]
             *
             * or
             *
             * data: {
             *     categories: [...]
             * }
             */

            if (Array.isArray(result)) {
                setCategories(result);
            } else if (Array.isArray(result?.categories)) {
                setCategories(result.categories);
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error("Failed to load categories:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load categories"
            );
        } finally {
            setLoading(false);
        }
    };

    // --------------------------------------------------
    // INITIAL LOAD
    // --------------------------------------------------

    useEffect(() => {
        loadCategories();
    }, []);

    // --------------------------------------------------
    // SEARCH
    // --------------------------------------------------

    const filteredCategories = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        if (!searchValue) {
            return categories;
        }

        return categories.filter((category) => {
            return (
                category.name
                    ?.toLowerCase()
                    .includes(searchValue) ||
                category.description
                    ?.toLowerCase()
                    .includes(searchValue)
            );
        });
    }, [categories, search]);

    // --------------------------------------------------
    // INPUT CHANGE
    // --------------------------------------------------

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: "",
        }));
    };

    // --------------------------------------------------
    // OPEN ADD MODAL
    // --------------------------------------------------

    const handleAdd = () => {
        setEditingCategory(null);

        setFormData(emptyForm);

        setErrors({});

        setIsModalOpen(true);
    };

    // --------------------------------------------------
    // OPEN EDIT MODAL
    // --------------------------------------------------

    const handleEdit = (category) => {
        setEditingCategory(category);

        setFormData({
            name: category.name || "",
            description: category.description || "",
        });

        setErrors({});

        setIsModalOpen(true);
    };

    // --------------------------------------------------
    // CLOSE MODAL
    // --------------------------------------------------

    const handleCloseModal = () => {
        if (saving) {
            return;
        }

        setIsModalOpen(false);

        setEditingCategory(null);

        setFormData(emptyForm);

        setErrors({});
    };

    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Category name is required";
        }

        if (formData.name.trim().length > 100) {
            newErrors.name =
                "Category name cannot exceed 100 characters";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // --------------------------------------------------
    // CREATE / UPDATE
    // --------------------------------------------------

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSaving(true);

            const payload = {
                name: formData.name.trim(),
                description: formData.description.trim(),
            };

            if (editingCategory) {
                await updateCategory(
                    editingCategory._id,
                    payload
                );

                toast.success(
                    "Category updated successfully"
                );
            } else {
                await createCategory(payload);

                toast.success(
                    "Category created successfully"
                );
            }

            handleCloseModal();

            await loadCategories();
        } catch (error) {
            console.error(
                "Category save error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to save category"
            );
        } finally {
            setSaving(false);
        }
    };

    // --------------------------------------------------
    // DELETE
    // --------------------------------------------------

    const handleDelete = async (category) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${category.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(category._id);

            await deleteCategory(category._id);

            toast.success(
                "Category deleted successfully"
            );

            await loadCategories();
        } catch (error) {
            console.error(
                "Category delete error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to delete category"
            );
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 md:p-8">

            {/* -------------------------------------- */}
            {/* PAGE HEADER */}
            {/* -------------------------------------- */}

            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Categories
                    </h1>

                    <p className="mt-1 text-gray-500">
                        Manage your product categories
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleAdd}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF9900] px-5 py-3 font-semibold text-black transition hover:bg-[#e88a00]"
                >
                    <Plus size={18} />

                    Add Category
                </button>

            </div>

            {/* -------------------------------------- */}
            {/* SEARCH */}
            {/* -------------------------------------- */}

            <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">

                <div className="relative max-w-md">

                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search categories..."
                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                </div>

            </div>

            {/* -------------------------------------- */}
            {/* TABLE */}
            {/* -------------------------------------- */}

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[700px]">

                        <thead>

                            <tr className="border-b bg-gray-50 text-left text-sm text-gray-600">

                                <th className="px-6 py-4 font-semibold">
                                    #
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    Name
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    Description
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    Created
                                </th>

                                <th className="px-6 py-4 text-right font-semibold">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {/* LOADING */}

                            {loading && (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="px-6 py-12 text-center text-gray-500"
                                    >
                                        Loading categories...
                                    </td>

                                </tr>

                            )}

                            {/* EMPTY */}

                            {!loading &&
                                filteredCategories.length === 0 && (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="px-6 py-12 text-center"
                                        >

                                            <div className="text-gray-500">

                                                {search
                                                    ? "No categories found"
                                                    : "No categories available"}

                                            </div>

                                            {!search && (

                                                <button
                                                    type="button"
                                                    onClick={handleAdd}
                                                    className="mt-3 font-semibold text-blue-600 hover:underline"
                                                >
                                                    Create your first category
                                                </button>

                                            )}

                                        </td>

                                    </tr>

                                )}

                            {/* DATA */}

                            {!loading &&
                                filteredCategories.map(
                                    (category, index) => (

                                        <tr
                                            key={category._id}
                                            className="border-b last:border-b-0 hover:bg-gray-50"
                                        >

                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {index + 1}
                                            </td>

                                            <td className="px-6 py-4">

                                                <div className="font-semibold text-gray-900">
                                                    {category.name}
                                                </div>

                                            </td>

                                            <td className="max-w-md px-6 py-4 text-sm text-gray-600">

                                                <div className="truncate">
                                                    {category.description ||
                                                        "—"}
                                                </div>

                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-500">

                                                {category.createdAt
                                                    ? new Date(
                                                        category.createdAt
                                                    ).toLocaleDateString()
                                                    : "—"}

                                            </td>

                                            <td className="px-6 py-4">

                                                <div className="flex justify-end gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                category
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                                                    >
                                                        <Pencil size={15} />

                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                category
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            category._id
                                                        }
                                                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >

                                                        <Trash2 size={15} />

                                                        {deletingId ===
                                                        category._id
                                                            ? "Deleting..."
                                                            : "Delete"}

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* -------------------------------------- */}
            {/* ADD / EDIT MODAL */}
            {/* -------------------------------------- */}

            {isModalOpen && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

                        {/* MODAL HEADER */}

                        <div className="flex items-center justify-between border-b px-6 py-5">

                            <div>

                                <h2 className="text-xl font-bold text-gray-900">

                                    {editingCategory
                                        ? "Edit Category"
                                        : "Add Category"}

                                </h2>

                                <p className="mt-1 text-sm text-gray-500">

                                    {editingCategory
                                        ? "Update category information"
                                        : "Create a new product category"}

                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={handleCloseModal}
                                disabled={saving}
                                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 p-6"
                        >

                            {/* NAME */}

                            <div>

                                <label
                                    htmlFor="category-name"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    Category Name
                                </label>

                                <input
                                    id="category-name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter category name"
                                    className={`w-full rounded-lg border px-4 py-3 outline-none transition focus:ring-2 ${
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

                            <div>

                                <label
                                    htmlFor="category-description"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    Description
                                </label>

                                <textarea
                                    id="category-description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Enter category description"
                                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                            </div>

                            {/* ACTIONS */}

                            <div className="flex justify-end gap-3 border-t pt-5">

                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={saving}
                                    className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-[#FF9900] px-5 py-2.5 font-semibold text-black hover:bg-[#e88a00] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingCategory
                                            ? "Update Category"
                                            : "Create Category"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
};

export default Categories;