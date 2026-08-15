import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, MapPin, Heart, ShoppingBag, User, Shield, Key, ChevronRight } from "lucide-react";
import { getProfile, updateProfile } from "../../services/user.service";
import { getMyOrders } from "../../services/order.service";
import { getWishlist } from "../../services/wishlist.service";
import { getAddresses } from "../../services/address.service";
import toast from "react-hot-toast";

const Account = () => {
    const [user, setUser] = useState({ firstName: "", lastName: "", email: "", role: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Stats for dashboard summary
    const [stats, setStats] = useState({
        ordersCount: 0,
        wishlistCount: 0,
        addressCount: 0,
        recentOrders: [],
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [profileRes, ordersRes, wishlistRes, addressRes] = await Promise.allSettled([
                    getProfile(),
                    getMyOrders(),
                    getWishlist(),
                    getAddresses(),
                ]);

                if (profileRes.status === "fulfilled" && profileRes.value.data?.data) {
                    setUser(profileRes.value.data.data);
                }

                const ordersData = ordersRes.status === "fulfilled" ? (ordersRes.value.data?.data || []) : [];
                const wishlistData = wishlistRes.status === "fulfilled" ? (wishlistRes.value.data?.data?.products || []) : [];
                const addressData = addressRes.status === "fulfilled" ? (addressRes.value.data?.data || []) : [];

                setStats({
                    ordersCount: ordersData.length,
                    wishlistCount: wishlistData.length,
                    addressCount: addressData.length,
                    recentOrders: ordersData.slice(0, 3),
                });
            } catch (err) {
                toast.error("Failed to load account dashboard");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const res = await updateProfile({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            });
            toast.success("Profile updated successfully!");
            if (res.data?.data) {
                setUser(res.data.data);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <div className="text-gray-500 font-semibold text-lg animate-pulse">Loading Your Account Dashboard...</div>
            </div>
        );
    }

    const cards = [
        {
            title: "Your Orders",
            description: "Track, return, or buy items again",
            count: stats.ordersCount > 0 ? `${stats.ordersCount} Total Orders` : "No orders yet",
            icon: Package,
            link: "/account/orders",
            color: "border-l-4 border-amber-500",
        },
        {
            title: "Your Addresses",
            description: "Edit addresses for orders & gifts",
            count: stats.addressCount > 0 ? `${stats.addressCount} Saved Addresses` : "Add address",
            icon: MapPin,
            link: "/account/addresses",
            color: "border-l-4 border-blue-500",
        },
        {
            title: "Your Wishlist",
            description: "View saved items & buy directly",
            count: stats.wishlistCount > 0 ? `${stats.wishlistCount} Saved Items` : "Empty wishlist",
            icon: Heart,
            link: "/account/wishlist",
            color: "border-l-4 border-red-500",
        },
        {
            title: "Shopping Cart",
            description: "Review items ready for checkout",
            count: "View items",
            icon: ShoppingBag,
            link: "/cart",
            color: "border-l-4 border-emerald-500",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                
                {/* Header Banner */}
                <div className="bg-white rounded-xl shadow-sm border p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-[#131921] text-white flex items-center justify-center text-2xl font-bold uppercase shadow">
                            {user.firstName ? user.firstName[0] : "A"}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Hello, {user.firstName || "Customer"} 👋
                            </h1>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <span className="inline-block mt-1 bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded capitalize">
                                {user.role || "Customer"} Account
                            </span>
                        </div>
                    </div>
                    <Link
                        to="/products"
                        className="bg-[#ff9900] hover:bg-amber-500 text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-colors shadow-sm"
                    >
                        Explore SwiftMart Deals →
                    </Link>
                </div>

                {/* Dashboard Grid Cards */}
                <h2 className="text-xl font-bold text-gray-900 mb-4">Account Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    {cards.map((card, idx) => {
                        const Icon = card.icon;
                        return (
                            <Link
                                key={idx}
                                to={card.link}
                                className={`bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition-all group ${card.color}`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2.5 bg-gray-100 rounded-lg group-hover:bg-amber-100 transition-colors">
                                        <Icon className="text-gray-700 group-hover:text-amber-700" size={24} />
                                    </div>
                                    <ChevronRight className="text-gray-400 group-hover:translate-x-1 transition-transform" size={18} />
                                </div>
                                <h3 className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors">{card.title}</h3>
                                <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                                <div className="mt-4 pt-3 border-t text-xs font-bold text-gray-700">
                                    {card.count}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Section: Profile Details & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left 2 Cols: Edit Profile Form */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center gap-2 mb-6 border-b pb-3">
                            <User className="text-amber-600" size={20} />
                            <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        value={user.firstName}
                                        onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                                        className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        value={user.lastName}
                                        onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                                        className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Role Permission</label>
                                <input
                                    type="text"
                                    value={user.role}
                                    disabled
                                    className="w-full rounded-lg border bg-gray-50 px-3.5 py-2.5 text-sm text-gray-500 capitalize cursor-not-allowed"
                                />
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-[#ff9900] hover:bg-amber-500 text-black font-bold px-6 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
                                >
                                    {saving ? "Saving Changes..." : "Save Profile Changes"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Col: Recent Orders Quick Card */}
                    <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4 border-b pb-3">
                                <div className="flex items-center gap-2">
                                    <Package className="text-amber-600" size={20} />
                                    <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                                </div>
                                <Link to="/account/orders" className="text-xs font-bold text-blue-600 hover:underline">
                                    View All
                                </Link>
                            </div>

                            {stats.recentOrders.length === 0 ? (
                                <div className="py-8 text-center text-gray-400">
                                    <Package size={36} className="mx-auto mb-2 opacity-30" />
                                    <p className="text-sm">No orders placed yet.</p>
                                    <Link to="/products" className="inline-block mt-3 text-xs font-bold text-amber-600 hover:underline">
                                        Start Shopping Now →
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {stats.recentOrders.map((order) => (
                                        <Link
                                            key={order._id}
                                            to={`/account/orders/${order._id}`}
                                            className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex justify-between items-center text-xs mb-1">
                                                <span className="font-mono font-bold text-gray-700">#{order._id.slice(-6)}</span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                                                    order.status === "Delivered" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                                                }`}>
                                                    {order.status || "Pending"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                                <span className="font-bold text-gray-900">₹{order.totalAmount?.toLocaleString("en-IN")}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-4 border-t text-xs text-gray-500 flex items-center gap-2">
                            <Shield size={16} className="text-green-600" />
                            <span>100% Secure & Private Account</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Account;
