import { useState, useEffect } from "react";
import { getAllOrders, updateOrderStatus } from "../../services/order.service";
import toast from "react-hot-toast";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await getAllOrders();
            if (res.data?.data) {
                setOrders(res.data.data);
            }
        } catch (err) {
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            toast.success("Order status updated");
            fetchOrders();
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading orders...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Order Management</h1>
                <span className="text-sm text-gray-500 font-medium">Total Orders: {orders.length}</span>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b text-xs font-semibold text-gray-600 uppercase">
                            <th className="py-3 px-4">Order #</th>
                            <th className="py-3 px-4">Customer</th>
                            <th className="py-3 px-4">Items</th>
                            <th className="py-3 px-4">Total</th>
                            <th className="py-3 px-4">Payment</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50">
                                <td className="py-3 px-4 font-mono font-medium text-xs">{order.orderNumber}</td>
                                <td className="py-3 px-4">
                                    <p className="font-medium">{order.shippingAddress?.fullName || order.user?.email}</p>
                                    <p className="text-xs text-gray-500">{order.shippingAddress?.city}</p>
                                </td>
                                <td className="py-3 px-4 text-xs">
                                    {order.items?.map((item, i) => (
                                        <div key={i}>{item.name} (x{item.quantity})</div>
                                    ))}
                                </td>
                                <td className="py-3 px-4 font-bold">₹{order.totalAmount?.toLocaleString("en-IN")}</td>
                                <td className="py-3 px-4 text-xs uppercase font-semibold">
                                    {order.paymentMethod} ({order.paymentStatus})
                                </td>
                                <td className="py-3 px-4">
                                    <select
                                        value={order.orderStatus}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        className="border rounded px-2 py-1 bg-white text-xs font-semibold"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td className="py-3 px-4 text-xs text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;
