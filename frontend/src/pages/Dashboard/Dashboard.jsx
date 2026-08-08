import { useEffect, useState } from "react";

import Header from "../../components/admin/Header";

import DashboardCard from "../../components/admin/DashboardCard";

import dashboardService from "../../services/dashboard.service";

const Dashboard = () => {

    const [stats, setStats] = useState({

        totalProducts: 0,

        totalCategories: 0,

        totalUsers: 0,

        totalOrders: 0

    });

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {

        const loadDashboardStats = async () => {

            try {

                setLoading(true);

                const response =
                    await dashboardService.getDashboardStats();

                setStats(
                    response.data.data
                );

            } catch (error) {

                console.error(
                    "Dashboard stats error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load dashboard statistics"
                );

            } finally {

                setLoading(false);

            }

        };

        loadDashboardStats();

    }, []);

    return (

        <div className="min-h-screen">

            <Header />

            <div className="p-6 md:p-8">

                {/* Page Heading */}

                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-gray-900">

                        Dashboard

                    </h1>

                    <p className="text-gray-500 mt-1">

                        Overview of your e-commerce store

                    </p>

                </div>

                {/* Error */}

                {error && (

                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">

                        {error}

                    </div>

                )}

                {/* Statistics */}

                {loading ? (

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                        <div className="h-32 animate-pulse rounded-xl bg-gray-200" />

                        <div className="h-32 animate-pulse rounded-xl bg-gray-200" />

                        <div className="h-32 animate-pulse rounded-xl bg-gray-200" />

                        <div className="h-32 animate-pulse rounded-xl bg-gray-200" />

                    </div>

                ) : (

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                        <DashboardCard

                            title="Products"

                            value={stats.totalProducts}

                            color="bg-blue-600"

                        />

                        <DashboardCard

                            title="Categories"

                            value={stats.totalCategories}

                            color="bg-green-600"

                        />

                        <DashboardCard

                            title="Orders"

                            value={stats.totalOrders}

                            color="bg-orange-500"

                        />

                        <DashboardCard

                            title="Users"

                            value={stats.totalUsers}

                            color="bg-purple-600"

                        />

                    </div>

                )}

                {/* Dashboard Sections */}

                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

                    {/* Recent Orders */}

                    <div className="rounded-xl bg-white p-6 shadow-sm">

                        <div className="flex items-center justify-between">

                            <h2 className="text-xl font-semibold">

                                Recent Orders

                            </h2>

                            <span className="text-sm text-gray-500">

                                Latest activity

                            </span>

                        </div>

                        <div className="mt-6 flex min-h-40 items-center justify-center text-gray-400">

                            No orders available yet

                        </div>

                    </div>

                    {/* Recent Products */}

                    <div className="rounded-xl bg-white p-6 shadow-sm">

                        <div className="flex items-center justify-between">

                            <h2 className="text-xl font-semibold">

                                Recent Products

                            </h2>

                            <span className="text-sm text-gray-500">

                                Latest products

                            </span>

                        </div>

                        <div className="mt-6 flex min-h-40 items-center justify-center text-gray-400">

                            No recent products to display

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default Dashboard;