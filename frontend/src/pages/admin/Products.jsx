import { useEffect, useMemo, useState } from "react";
import {
    Eye,
    Pencil,
    Plus,
    Search,
    Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import {
    getProducts,
    deleteProduct,
} from "../../services/product.service";
import { useNavigate } from "react-router-dom";


const Products = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [deletingId, setDeletingId] = useState(null);

    const [search, setSearch] = useState("");

    // --------------------------------------------------
    // LOAD PRODUCTS
    // --------------------------------------------------

    const loadProducts = async () => {

        try {

            setLoading(true);

            const response = await getProducts();

            const result = response.data?.data;

            if (Array.isArray(result)) {

                setProducts(result);

            } else {

                setProducts([]);

            }

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

            setLoading(false);

        }

    };

    // --------------------------------------------------
    // INITIAL LOAD
    // --------------------------------------------------

    useEffect(() => {

        loadProducts();

    }, []);

    // --------------------------------------------------
    // SEARCH
    // --------------------------------------------------

    const filteredProducts = useMemo(() => {
        const searchValue = search.trim().toLowerCase();
    
        if (!searchValue) {
            return products;
        }
    
        return products.filter((product) => {
            const name =
                product.name?.toLowerCase() || "";
    
            const sku =
                product.sku?.toLowerCase() || "";
    
            const category =
                product.category?.name?.toLowerCase() || "";
    
            const description =
                product.description?.toLowerCase() || "";
    
            const status =
                product.status?.toLowerCase() || "";
    
            return (
                name.includes(searchValue) ||
                sku.includes(searchValue) ||
                category.includes(searchValue) ||
                description.includes(searchValue) ||
                status.includes(searchValue)
            );
        });
    }, [products, search]);

    // --------------------------------------------------
    // DELETE PRODUCT
    // --------------------------------------------------

    const handleDelete = async (product) => {

        const confirmed = window.confirm(

            `Are you sure you want to delete "${product.name}"?`

        );

        if (!confirmed) {

            return;

        }

        try {

            setDeletingId(product._id);

            await deleteProduct(product._id);

            toast.success(
                "Product deleted successfully"
            );

            await loadProducts();

        } catch (error) {

            console.error(
                "Product delete error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to delete product"
            );

        } finally {

            setDeletingId(null);

        }

    };

    // --------------------------------------------------
    // FORMAT PRICE
    // --------------------------------------------------

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

    // --------------------------------------------------
    // STATUS BADGE
    // --------------------------------------------------

    const getStatusClasses = (status) => {

        switch (status) {

            case "published":

                return "bg-green-100 text-green-700";

            case "draft":

                return "bg-yellow-100 text-yellow-700";

            case "archived":

                return "bg-gray-100 text-gray-700";

            default:

                return "bg-gray-100 text-gray-700";

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

                        Products

                    </h1>

                    <p className="mt-1 text-gray-500">

                        Manage your products and inventory

                    </p>

                </div>

                <button

                    type="button"

                    onClick={() => navigate("/admin/products/create")}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF9900] px-5 py-3 font-semibold text-black transition hover:bg-[#e88a00]"

                >

                    <Plus size={18} />

                    Add Product

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

                        placeholder="Search by product, SKU or category..."

                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

                    />

                </div>

            </div>

            {/* -------------------------------------- */}
            {/* TABLE */}
            {/* -------------------------------------- */}

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[1100px]">

                        <thead>

                            <tr className="border-b bg-gray-50 text-left text-sm text-gray-600">

                                <th className="px-6 py-4 font-semibold">
                                    Product
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    SKU
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    Category
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    Price
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    Stock
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    Status
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

                                        colSpan="7"

                                        className="px-6 py-12 text-center text-gray-500"

                                    >

                                        Loading products...

                                    </td>

                                </tr>

                            )}

                            {/* EMPTY */}

                            {!loading &&
                                filteredProducts.length === 0 && (

                                    <tr>

                                        <td

                                            colSpan="7"

                                            className="px-6 py-12 text-center text-gray-500"

                                        >

                                            {search

                                                ? "No products found"

                                                : "No products available"

                                            }

                                        </td>

                                    </tr>

                                )}

                            {/* PRODUCTS */}

                            {!loading &&

                                filteredProducts.map(
                                    (product) => (

                                        <tr

                                            key={product._id}

                                            className="border-b last:border-b-0 hover:bg-gray-50"

                                        >

                                            {/* PRODUCT */}

                                            <td className="px-6 py-4">

                                                <div className="flex items-center gap-4">

                                                    <div className="h-14 w-14 overflow-hidden rounded-lg border bg-gray-100">

                                                        {product.thumbnail ? (

                                                            <img

                                                                src={product.thumbnail}

                                                                alt={product.name}

                                                                className="h-full w-full object-cover"

                                                            />

                                                        ) : (

                                                            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">

                                                                No Image

                                                            </div>

                                                        )}

                                                    </div>

                                                    <div>

                                                        <div className="font-semibold text-gray-900">

                                                            {product.name}

                                                        </div>

                                                        <div className="text-sm text-gray-500">

                                                            {product.slug}

                                                        </div>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* SKU */}

                                            <td className="px-6 py-4 text-sm text-gray-600">

                                                {product.sku || "—"}

                                            </td>

                                            {/* CATEGORY */}

                                            <td className="px-6 py-4">

                                                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">

                                                    {product.category?.name ||
                                                        "Uncategorized"}

                                                </span>

                                            </td>

                                            {/* PRICE */}

                                            <td className="px-6 py-4">

                                                <div className="font-semibold text-gray-900">

                                                    {formatPrice(
                                                        product.salePrice ||
                                                        product.price
                                                    )}

                                                </div>

                                                {product.salePrice &&
                                                    product.price >
                                                        product.salePrice && (

                                                        <div className="text-xs text-gray-400 line-through">

                                                            {formatPrice(
                                                                product.price
                                                            )}

                                                        </div>

                                                    )}

                                            </td>

                                            {/* STOCK */}

                                            <td className="px-6 py-4">

                                                <span

                                                    className={

                                                        product.stock === 0

                                                            ? "font-semibold text-red-600"

                                                            : product.stock < 10

                                                                ? "font-semibold text-orange-600"

                                                                : "text-gray-700"

                                                    }

                                                >

                                                    {product.stock}

                                                </span>

                                            </td>

                                            {/* STATUS */}

                                            <td className="px-6 py-4">

                                                <span

                                                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                                                        product.status
                                                    )}`}

                                                >

                                                    {product.status}

                                                </span>

                                            </td>

                                            {/* ACTIONS */}

                                            <td className="px-6 py-4">

                                                <div className="flex justify-end gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(`/admin/products/${product._id}`)
                                                        }
                                                        className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-100"
                                                        title="View Product"
                                                    >
                                                        <Eye size={16} />
                                                    </button>

                                                    <button

                                                        type="button"

                                                        onClick={() =>
                                                            navigate(`/admin/products/${product._id}/edit`)
                                                        }

                                                        className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-100"

                                                        title="Edit Product"

                                                    >

                                                        <Pencil size={16} />

                                                    </button>

                                                    <button

                                                        type="button"

                                                        onClick={() =>
                                                            handleDelete(
                                                                product
                                                            )
                                                        }

                                                        disabled={
                                                            deletingId ===
                                                            product._id
                                                        }

                                                        className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"

                                                        title="Delete Product"

                                                    >

                                                        <Trash2 size={16} />

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

        </div>

    );

};

export default Products;