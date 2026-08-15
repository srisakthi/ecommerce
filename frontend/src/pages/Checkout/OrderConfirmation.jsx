import { useParams, Link } from "react-router-dom";

const OrderConfirmation = () => {
    const { id } = useParams();

    return (
        <div className="min-h-[70vh] bg-gray-100 flex items-center justify-center py-12 px-4">
            <div className="bg-white max-w-lg w-full p-8 rounded-lg shadow-sm text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                    ✓
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h1>
                <p className="text-gray-600 mb-6">
                    Thank you for your purchase. Your order has been placed successfully.
                </p>
                <div className="bg-gray-50 p-4 rounded-md mb-6 text-sm text-left">
                    <p className="text-gray-500">Order ID:</p>
                    <p className="font-mono font-bold text-gray-800 break-all">{id}</p>
                </div>
                <div className="flex gap-4 justify-center">
                    <Link
                        to={`/account/orders/${id}`}
                        className="bg-[#ff9900] px-6 py-2.5 rounded-md font-semibold text-black hover:bg-orange-500"
                    >
                        View Order Details
                    </Link>
                    <Link
                        to="/products"
                        className="border border-gray-300 px-6 py-2.5 rounded-md font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
