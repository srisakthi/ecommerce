import { useState } from "react";
import { FaShoppingCart, FaSearch, FaMapMarkerAlt, FaHeart, FaUser, FaChevronDown, FaStore } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchCategory, setSearchCategory] = useState("all");

    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const cartItems = useSelector((state) => state.cart.items || []);

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate("/products");
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <header className="bg-[#131921] text-white sticky top-0 z-50 shadow-md">
            <div className="max-w-[1500px] mx-auto flex items-center justify-between gap-3 md:gap-4 px-4 py-2.5">
                
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-1 text-2xl md:text-3xl font-extrabold tracking-tight text-white hover:opacity-90 transition-opacity pr-2 border-r border-gray-700/50">
                    <span className="text-white">Nex</span>
                    <span className="text-[#ff9900]">Cart</span>
                    <span className="text-[10px] bg-[#ff9900] text-black font-black px-1.5 py-0.5 rounded tracking-widest uppercase ml-0.5">IN</span>
                </Link>

                {/* Location Picker */}
                <Link
                    to="/account/addresses"
                    className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-gray-800 border border-transparent hover:border-gray-500 transition-all text-left"
                >
                    <FaMapMarkerAlt className="text-base text-[#ff9900]" />
                    <div>
                        <p className="text-[11px] text-gray-400 leading-none">Deliver to</p>
                        <h3 className="font-bold text-xs text-white leading-tight">India</h3>
                    </div>
                </Link>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex flex-1 max-w-3xl rounded-lg overflow-hidden border-2 border-transparent focus-within:border-[#ff9900] transition-all">
                    <select
                        value={searchCategory}
                        onChange={(e) => setSearchCategory(e.target.value)}
                        className="hidden sm:block bg-gray-200 text-gray-800 text-xs px-2.5 py-2 font-medium outline-none border-r cursor-pointer hover:bg-gray-300"
                    >
                        <option value="all">All Depts</option>
                        <option value="electronics">Electronics</option>
                        <option value="fashion">Fashion</option>
                        <option value="home">Home & Kitchen</option>
                    </select>

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 px-3 py-2 text-black outline-none text-sm bg-white placeholder-gray-500"
                        placeholder="Search NexCart products, brands and deals..."
                    />

                    <button
                        type="submit"
                        className="bg-[#ff9900] px-5 hover:bg-[#e88a00] active:bg-amber-600 transition-colors text-gray-950 font-bold flex items-center justify-center text-base"
                        title="Search NexCart"
                    >
                        <FaSearch />
                    </button>
                </form>

                {/* Right Side Navigation */}
                <div className="flex items-center gap-2 md:gap-3">
                    
                    {/* Account / User Dropdown */}
                    <div className="relative group px-2 py-1.5 rounded-md hover:bg-gray-800 border border-transparent hover:border-gray-500 transition-all cursor-pointer">
                        {isAuthenticated ? (
                            <div className="text-left">
                                <p className="text-[11px] text-gray-300 leading-none">
                                    Hello, {user?.firstName || "Customer"}
                                </p>
                                <h3 className="font-bold text-xs md:text-sm text-white flex items-center gap-1 leading-tight">
                                    Account & Lists <FaChevronDown className="text-[10px] text-gray-400 group-hover:rotate-180 transition-transform" />
                                </h3>
                            </div>
                        ) : (
                            <Link to="/login" className="text-left block">
                                <p className="text-[11px] text-gray-300 leading-none">Hello, Sign In</p>
                                <h3 className="font-bold text-xs md:text-sm text-white flex items-center gap-1 leading-tight">
                                    Account & Lists <FaChevronDown className="text-[10px] text-gray-400 group-hover:rotate-180 transition-transform" />
                                </h3>
                            </Link>
                        )}

                        {/* Interactive Dropdown Menu */}
                        <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-white text-black shadow-2xl rounded-xl w-56 border border-gray-200 py-2 text-sm z-50 animate-in fade-in duration-150">
                            {isAuthenticated ? (
                                <>
                                    <div className="px-4 py-2.5 border-b bg-gray-50">
                                        <p className="font-bold text-gray-900">{user?.firstName} {user?.lastName}</p>
                                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                    </div>
                                    <Link to="/account" className="flex items-center gap-2 px-4 py-2 hover:bg-amber-50 hover:text-amber-700 font-medium">
                                        <FaUser className="text-gray-400 text-xs" /> Your Account
                                    </Link>
                                    <Link to="/account/orders" className="flex items-center gap-2 px-4 py-2 hover:bg-amber-50 hover:text-amber-700 font-medium">
                                        <FaShoppingCart className="text-gray-400 text-xs" /> Your Orders
                                    </Link>
                                    <Link to="/account/addresses" className="flex items-center gap-2 px-4 py-2 hover:bg-amber-50 hover:text-amber-700 font-medium">
                                        <FaMapMarkerAlt className="text-gray-400 text-xs" /> Saved Addresses
                                    </Link>
                                    <Link to="/account/wishlist" className="flex items-center gap-2 px-4 py-2 hover:bg-amber-50 hover:text-amber-700 font-medium">
                                        <FaHeart className="text-gray-400 text-xs" /> Your Wishlist
                                    </Link>
                                    {(user?.role === "admin" || user?.role === "seller") && (
                                        <Link to="/admin" className="flex items-center gap-2 px-4 py-2 hover:bg-orange-100 font-bold text-amber-700 border-t border-b">
                                            <FaStore className="text-amber-600 text-xs" /> {user?.role === "admin" ? "Admin Management" : "Seller Dashboard"}
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-bold border-t transition-colors mt-1"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <div className="p-4 text-center">
                                    <Link to="/login" className="block bg-[#ff9900] text-black font-bold py-2 rounded-lg mb-2 hover:bg-[#e88a00] transition-colors shadow">
                                        Sign In
                                    </Link>
                                    <span className="text-xs text-gray-500">
                                        New customer? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Start here.</Link>
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Wishlist Link */}
                    <Link
                        to="/account/wishlist"
                        className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-gray-800 border border-transparent hover:border-gray-500 transition-all"
                        title="View Wishlist"
                    >
                        <FaHeart className="text-red-400 text-sm" />
                        <span className="text-xs font-bold text-white">Wishlist</span>
                    </Link>

                    {/* Orders Link */}
                    <Link
                        to="/account/orders"
                        className="hidden sm:block px-2.5 py-1.5 rounded-md hover:bg-gray-800 border border-transparent hover:border-gray-500 transition-all text-left"
                    >
                        <p className="text-[11px] text-gray-300 leading-none">Returns</p>
                        <h3 className="font-bold text-xs md:text-sm text-white leading-tight">& Orders</h3>
                    </Link>

                    {/* Cart Badge */}
                    <Link
                        to="/cart"
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-gray-800 border border-transparent hover:border-gray-500 transition-all relative group"
                    >
                        <div className="relative">
                            <FaShoppingCart className="text-xl md:text-2xl text-white group-hover:text-[#ff9900] transition-colors" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#ff9900] text-black font-black text-[11px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center shadow">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        <span className="font-bold text-xs md:text-sm text-white hidden sm:inline">Cart</span>
                    </Link>

                </div>

            </div>
        </header>
    );
};

export default Header;