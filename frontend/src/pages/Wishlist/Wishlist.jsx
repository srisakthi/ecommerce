import { useState, useEffect } from "react";
import { getWishlist, removeFromWishlist } from "../../services/wishlist.service";
import { addToCart } from "../../features/cart/cartSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getProductImage, DEFAULT_PRODUCT_IMAGE } from "../../utils/image";

const Wishlist = () => {
    const [wishlist, setWishlist] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const fetchWishlist = async () => {
        try {
            const res = await getWishlist();
            if (res.data?.data) {
                setWishlist(res.data.data);
            }
        } catch (err) {
            toast.error("Failed to load wishlist");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const handleRemove = async (productId) => {
        try {
            await removeFromWishlist(productId);
            toast.success("Removed from wishlist");
            fetchWishlist();
        } catch (err) {
            toast.error("Failed to remove item");
        }
    };

    const handleAddToCart = (product) => {
        dispatch(
            addToCart({
                productId: product._id,
                name: product.name,
                price: product.salePrice || product.price,
                thumbnail: product.thumbnail,
                quantity: 1,
                stock: product.stock,
            })
        );
        toast.success("Added to cart");
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-semibold animate-pulse">Loading wishlist...</div>;

    const products = wishlist?.products || [];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-extrabold mb-6 text-gray-900">Your Wishlist ({products.length})</h1>

                {products.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl shadow-sm border text-center">
                        <p className="text-xl font-bold text-gray-800 mb-4">Your wishlist is empty.</p>
                        <Link to="/products" className="bg-[#ff9900] hover:bg-[#e88a00] px-6 py-2.5 rounded-lg font-bold text-black inline-block transition-colors">
                            Explore Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((prod) => (
                            <div key={prod._id} className="bg-white rounded-xl shadow-sm border p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div>
                                    <div className="w-full h-48 flex items-center justify-center bg-gray-50 rounded-lg mb-4 overflow-hidden p-2">
                                        <img
                                            src={getProductImage(prod)}
                                            alt={prod.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = DEFAULT_PRODUCT_IMAGE;
                                            }}
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                    <h3 className="font-bold text-base text-gray-900 line-clamp-2">{prod.name}</h3>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="text-lg font-extrabold text-gray-900">
                                            ₹{(prod.salePrice || prod.price)?.toLocaleString("en-IN")}
                                        </span>
                                        {prod.salePrice > 0 && prod.salePrice < prod.price && (
                                            <span className="text-xs text-gray-400 line-through">₹{prod.price?.toLocaleString("en-IN")}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <button
                                        onClick={() => handleAddToCart(prod)}
                                        className="w-full bg-[#ff9900] hover:bg-[#e88a00] py-2 rounded-lg font-bold text-sm text-black transition-colors"
                                    >
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() => handleRemove(prod._id)}
                                        className="w-full border border-gray-300 py-1.5 rounded-lg text-sm text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
