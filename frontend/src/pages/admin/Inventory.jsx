import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getLowStockProducts, updateStock } from "../../services/inventory.service";
import toast from "react-hot-toast";

const AdminInventory = () => {
    const { user } = useSelector(state => state.auth);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [threshold, setThreshold] = useState(15);
    const [editingId, setEditingId] = useState(null);
    const [newStock, setNewStock] = useState("");

    const fetchInventory = async () => {
        try {
            let query = `?threshold=${threshold}`;
            if (user?.role === "seller") {
                query += `&seller=${user._id || user.id}`;
            }
            const res = await getLowStockProducts(query);
            if (res.data?.data) {
                setProducts(res.data.data);
            }
        } catch (err) {
            toast.error("Failed to fetch inventory");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, [threshold]);

    const handleSaveStock = async (productId) => {
        try {
            await updateStock(productId, Number(newStock));
            toast.success("Stock updated");
            setEditingId(null);
            fetchInventory();
        } catch (err) {
            toast.error("Failed to update stock");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading inventory...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Inventory Management</h1>
                    <p className="text-sm text-gray-500">Monitor and update low-stock items</p>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold">Low Stock Threshold:</label>
                    <input
                        type="number"
                        value={threshold}
                        onChange={(e) => setThreshold(Number(e.target.value))}
                        className="w-20 border rounded px-2 py-1 text-sm text-center"
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b text-xs font-semibold text-gray-600 uppercase">
                            <th className="py-3 px-4">Product</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">SKU</th>
                            <th className="py-3 px-4">Current Stock</th>
                            <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-6 text-gray-500">
                                    No products below stock threshold ({threshold}).
                                </td>
                            </tr>
                        ) : (
                            products.map((p) => (
                                <tr key={p._id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium flex items-center gap-3">
                                        {p.thumbnail && (
                                            <img src={p.thumbnail} alt={p.name} className="w-10 h-10 object-cover rounded border" />
                                        )}
                                        <span>{p.name}</span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">{p.category?.name || "N/A"}</td>
                                    <td className="py-3 px-4 font-mono text-xs text-gray-500">{p.sku}</td>
                                    <td className="py-3 px-4 font-bold">
                                        <span className={`px-2 py-1 rounded text-xs ${p.stock <= 5 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {p.stock} units
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        {editingId === p._id ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <input
                                                    type="number"
                                                    value={newStock}
                                                    onChange={(e) => setNewStock(e.target.value)}
                                                    className="w-20 border rounded px-2 py-1 text-xs"
                                                />
                                                <button
                                                    onClick={() => handleSaveStock(p._id)}
                                                    className="bg-green-600 text-white text-xs px-3 py-1 rounded font-bold"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="text-gray-500 text-xs hover:underline"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => { setEditingId(p._id); setNewStock(p.stock); }}
                                                className="text-blue-600 font-semibold text-xs hover:underline"
                                            >
                                                Update Stock
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminInventory;
