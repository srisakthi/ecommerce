import { useState, useEffect } from "react";
import { getMyOrders } from "../../services/order.service";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await getMyOrders();
                if (res.data?.data) {
                    setOrders(res.data.data);
                }
            } catch (err) {
                toast.error("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading orders...</div>;

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

                {orders.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                        <p className="text-xl font-medium mb-4">You haven't placed any orders yet.</p>
                        <Link to="/products" className="bg-[#ff9900] px-6 py-2 rounded-md font-semibold inline-block">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                                <div className="bg-gray-50 px-6 py-4 border-b flex flex-wrap justify-between items-center text-sm">
                                    <div className="flex gap-8">
                                        <div>
                                            <p className="text-gray-500 uppercase text-xs">ORDER PLACED</p>
                                            <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 uppercase text-xs">TOTAL</p>
                                            <p className="font-semibold">₹{order.totalAmount?.toLocaleString("en-IN")}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 uppercase text-xs">SHIP TO</p>
                                            <p className="font-semibold">{order.shippingAddress?.fullName}</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:mt-0 text-right">
                                        <p className="text-gray-500 uppercase text-xs">ORDER # {order.orderNumber}</p>
                                        <Link to={`/account/orders/${order._id}`} className="text-blue-600 hover:underline font-medium text-sm">
                                            View Order Details
                                        </Link>
                                    </div>
                                </div>

                                <div className="p-6 divide-y">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                                            {item.thumbnail ? (
                                                <img src={item.thumbnail} alt={item.name} className="w-16 h-16 object-cover rounded border" />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                                                    No Image
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                                <p className="text-sm text-gray-600">Qty: {item.quantity} × ₹{item.price}</p>
                                                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-800">
                                                    Status: {order.orderStatus}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
