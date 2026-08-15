import { useState, useEffect } from "react";
import { getCouponsAdmin, createCouponAdmin, deleteCouponAdmin } from "../../services/coupon.service";
import toast from "react-hot-toast";

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minOrderValue: 0,
        maxDiscount: 0,
        expiryDate: "",
        usageLimit: 0,
    });

    const fetchCoupons = async () => {
        try {
            const res = await getCouponsAdmin();
            if (res.data?.data) {
                setCoupons(res.data.data);
            }
        } catch (err) {
            toast.error("Failed to fetch coupons");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createCouponAdmin({
                ...formData,
                discountValue: Number(formData.discountValue),
                minOrderValue: Number(formData.minOrderValue),
                maxDiscount: Number(formData.maxDiscount),
                usageLimit: Number(formData.usageLimit),
            });
            toast.success("Coupon created successfully!");
            setShowForm(false);
            setFormData({
                code: "",
                discountType: "percentage",
                discountValue: "",
                minOrderValue: 0,
                maxDiscount: 0,
                expiryDate: "",
                usageLimit: 0,
            });
            fetchCoupons();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create coupon");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this coupon?")) return;
        try {
            await deleteCouponAdmin(id);
            toast.success("Coupon deleted");
            fetchCoupons();
        } catch (err) {
            toast.error("Failed to delete coupon");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading coupons...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Coupons & Promo Codes</h1>
                    <p className="text-sm text-gray-500">Manage promotional discounts for checkout</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-[#ff9900] px-4 py-2 rounded-md font-semibold text-sm hover:bg-orange-500"
                >
                    {showForm ? "Cancel" : "+ Create Coupon"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                        <label className="block text-sm font-medium">Coupon Code</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. SAVE20"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            className="w-full rounded border px-3 py-2 text-sm uppercase"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Discount Type</label>
                        <select
                            value={formData.discountType}
                            onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                            className="w-full rounded border px-3 py-2 text-sm bg-white"
                        >
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed Amount (₹)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Discount Value</label>
                        <input
                            type="number"
                            required
                            value={formData.discountValue}
                            onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                            className="w-full rounded border px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Min Order Value (₹)</label>
                        <input
                            type="number"
                            value={formData.minOrderValue}
                            onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                            className="w-full rounded border px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Expiry Date</label>
                        <input
                            type="date"
                            required
                            value={formData.expiryDate}
                            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                            className="w-full rounded border px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Usage Limit (0 = Unlimited)</label>
                        <input
                            type="number"
                            value={formData.usageLimit}
                            onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                            className="w-full rounded border px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="md:col-span-3">
                        <button type="submit" className="bg-[#ff9900] px-6 py-2 rounded font-bold text-sm hover:bg-orange-500">
                            Save Coupon
                        </button>
                    </div>
                </form>
            )}

            <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b text-xs font-semibold text-gray-600 uppercase">
                            <th className="py-3 px-4">Code</th>
                            <th className="py-3 px-4">Discount</th>
                            <th className="py-3 px-4">Min Order</th>
                            <th className="py-3 px-4">Expiry Date</th>
                            <th className="py-3 px-4">Used Count</th>
                            <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                        {coupons.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-gray-500">
                                    No coupons created yet.
                                </td>
                            </tr>
                        ) : (
                            coupons.map((c) => (
                                <tr key={c._id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 font-mono font-bold text-xs uppercase">{c.code}</td>
                                    <td className="py-3 px-4 font-semibold text-green-700">
                                        {c.discountType === "percentage" ? `${c.discountValue}%` : `₹${c.discountValue}`}
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">₹{c.minOrderValue}</td>
                                    <td className="py-3 px-4 text-gray-500">{new Date(c.expiryDate).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 text-gray-500">{c.usedCount} {c.usageLimit > 0 ? `/ ${c.usageLimit}` : ''}</td>
                                    <td className="py-3 px-4 text-right">
                                        <button onClick={() => handleDelete(c._id)} className="text-red-600 font-semibold text-xs hover:underline">
                                            Delete
                                        </button>
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

export default AdminCoupons;
