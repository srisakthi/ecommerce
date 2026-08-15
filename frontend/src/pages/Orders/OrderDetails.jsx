import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMyOrderById } from "../../services/order.service";
import toast from "react-hot-toast";

const API_BASE_URL = "http://localhost:5000";

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await getMyOrderById(id);
                if (res.data?.data) {
                    setOrder(res.data.data);
                }
            } catch (err) {
                toast.error("Failed to load order details");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const getImageUrl = (image) => {
        if (!image) return "";
        if (image.startsWith("http")) return image;
        return `${API_BASE_URL}${image}`;
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-semibold animate-pulse">Loading order details...</div>;
    if (!order) return <div className="p-8 text-center text-red-500 font-bold">Order not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900">Order Details</h1>
                    <Link to="/account/orders" className="text-blue-600 hover:text-blue-800 font-bold text-sm">
                        ← Back to Orders
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b pb-6 mb-6 text-sm">
                        <div>
                            <h3 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">Shipping Address</h3>
                            <p className="font-bold text-gray-900">{order.shippingAddress?.fullName}</p>
                            <p className="text-gray-700">{order.shippingAddress?.addressLine1}</p>
                            {order.shippingAddress?.addressLine2 && <p className="text-gray-700">{order.shippingAddress?.addressLine2}</p>}
                            <p className="text-gray-700">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}</p>
                            <p className="text-gray-600 mt-1">Phone: {order.shippingAddress?.phone}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">Payment Method</h3>
                            <p className="font-bold text-gray-900 uppercase">{order.paymentMethod}</p>
                            <p className="mt-2 text-xs">
                                Payment Status:{" "}
                                <span className={`font-bold px-2 py-0.5 rounded capitalize ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                    {order.paymentStatus}
                                </span>
                            </p>
                            <p className="mt-2 text-xs">
                                Order Status:{" "}
                                <span className={`font-bold px-2 py-0.5 rounded capitalize ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                    {order.status || 'Pending'}
                                </span>
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">Order Summary</h3>
                            <div className="flex justify-between py-1 text-gray-600">
                                <span>Subtotal:</span>
                                <span className="font-semibold text-gray-900">₹{order.subtotal?.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span>Shipping:</span>
                                <span className="text-green-600 font-bold">FREE Express</span>
                            </div>
                            <div className="flex justify-between py-2 font-extrabold border-t mt-2 pt-2 text-base text-gray-900">
                                <span>Total Paid:</span>
                                <span className="text-amber-600">₹{order.totalAmount?.toLocaleString("en-IN")}</span>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-lg font-bold text-gray-900 mb-4">Items Ordered ({order.items?.length || 0})</h2>
                    <div className="divide-y">
                        {order.items.map((item, idx) => {
                            const imgSrc = getImageUrl(item.thumbnail || item.product?.thumbnail);
                            return (
                                <div key={idx} className="py-4 flex items-center gap-4">
                                    <div className="w-20 h-20 bg-gray-50 rounded-lg border overflow-hidden flex items-center justify-center shrink-0">
                                        {imgSrc ? (
                                            <img src={imgSrc} alt={item.name} className="w-full h-full object-contain p-1" />
                                        ) : (
                                            <span className="text-2xl">📦</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-base text-gray-900">{item.name}</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">Quantity: {item.quantity}</p>
                                        <p className="text-sm font-semibold text-gray-700 mt-1">Unit Price: ₹{item.price?.toLocaleString("en-IN")}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-gray-900">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
