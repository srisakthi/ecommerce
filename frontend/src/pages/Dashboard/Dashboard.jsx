import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/admin/Header";
import DashboardCard from "../../components/admin/DashboardCard";
import dashboardService from "../../services/dashboard.service";
import { useSelector } from "react-redux";

const Dashboard = () => {
    const { user } = useSelector(state => state.auth);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCategories: 0,
        totalUsers: 0,
        totalOrders: 0,
        recentOrders: [],
        recentProducts: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDashboardStats = async () => {
            try {
                setLoading(true);
                const response = await dashboardService.getDashboardStats();
                if (response.data?.data) {
                    setStats(response.data.data);
                }
            } catch (err) {
                console.error("Dashboard stats error:", err);
                setError(err.response?.data?.message || "Unable to load dashboard statistics");
            } finally {
                setLoading(false);
            }
        };

        loadDashboardStats();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="p-6 md:p-8">
                {/* Page Heading */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1">Real-time overview of store metrics, inventory, and orders</p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                        {error}
                    </div>
                )}

                {/* Statistics Cards */}
                {loading ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-200" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <DashboardCard
                            title="Total Products"
                            value={stats.totalProducts || 0}
                            color="bg-blue-600"
                        />
                        <DashboardCard
                            title="Total Categories"
                            value={stats.totalCategories || 0}
                            color="bg-green-600"
                        />
                        <DashboardCard
                            title="Total Orders"
                            value={stats.totalOrders || 0}
                            color="bg-orange-500"
                        />
                        {user?.role === "admin" && (
                            <DashboardCard
                                title="Registered Users"
                                value={stats.totalUsers || 0}
                                color="bg-purple-600"
                            />
                        )}
                    </div>
                )}

                {/* Dashboard Activity Grids */}
                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    
                    {/* Recent Orders */}
                    <div className="rounded-xl bg-white p-6 shadow-sm border">
                        <div className="flex items-center justify-between border-b pb-4">
                            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                            <Link to="/admin/orders" className="text-xs font-bold text-blue-600 hover:underline">
                                View All Orders →
                            </Link>
                        </div>

                        {!stats.recentOrders || stats.recentOrders.length === 0 ? (
                            <div className="mt-6 py-12 text-center text-gray-400 text-sm">
                                No recent orders to display.
                            </div>
                        ) : (
                            <div className="mt-4 divide-y">
                                {stats.recentOrders.map((order) => (
                                    <div key={order._id} className="py-3 flex items-center justify-between text-sm">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                Order #{order._id?.slice(-6)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Customer: {order.user?.firstName || "Guest"} ({order.user?.email || "N/A"})
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">
                                                ₹{order.totalAmount?.toLocaleString("en-IN")}
                                            </p>
                                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                                                order.status === "Delivered" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                                            }`}>
                                                {order.status || "Pending"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Products */}
                    <div className="rounded-xl bg-white p-6 shadow-sm border">
                        <div className="flex items-center justify-between border-b pb-4">
                            <h2 className="text-lg font-bold text-gray-900">Recently Added Products</h2>
                            <Link to="/admin/products" className="text-xs font-bold text-blue-600 hover:underline">
                                View All Products →
                            </Link>
                        </div>

                        {!stats.recentProducts || stats.recentProducts.length === 0 ? (
                            <div className="mt-6 py-12 text-center text-gray-400 text-sm">
                                No recent products to display.
                            </div>
                        ) : (
                            <div className="mt-4 divide-y">
                                {stats.recentProducts.map((p) => (
                                    <div key={p._id} className="py-3 flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-3">
                                            {p.thumbnail ? (
                                                <img src={p.thumbnail} alt={p.name} className="w-10 h-10 object-cover rounded border" />
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xs">📦</div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-gray-900 line-clamp-1">{p.name}</p>
                                                <p className="text-xs text-gray-500">Stock: {p.stock} units</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-gray-900">
                                            ₹{Number(p.salePrice || p.price || 0).toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;