import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTag, FaHeadset, FaGift, FaTicketAlt, FaStore, FaTimes, FaChevronRight } from "react-icons/fa";
import toast from "react-hot-toast";

const MenuBar = () => {
    const navigate = useNavigate();
    const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
    const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

    const handleDealsClick = () => {
        toast.success("Showing Today's Top Deals & Offers!", { icon: "🔥" });
        navigate("/products?sort=popular");
    };

    const handleCouponsClick = () => {
        toast("Use Code 'SWIFTMART10' for 10% OFF on all orders!", {
            icon: "🎟️",
            style: { background: "#131921", color: "#fff", border: "1px solid #ff9900" },
        });
    };

    return (
        <>
            <nav className="bg-[#232F3E] text-white text-xs md:text-sm border-b border-gray-700/50 select-none">
                <div className="max-w-[1500px] mx-auto flex items-center justify-between px-4 py-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
                    
                    {/* Left Menu Items */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        
                        {/* All Drawer Toggle */}
                        <button
                            onClick={() => setIsCategoryDrawerOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-[#37475A] font-bold text-white transition-colors cursor-pointer border border-transparent hover:border-gray-500"
                        >
                            <FaBars className="text-base text-[#ff9900]" />
                            <span>All</span>
                        </button>

                        {/* Today's Deals */}
                        <button
                            onClick={handleDealsClick}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-[#37475A] font-medium text-gray-200 hover:text-white transition-colors cursor-pointer border border-transparent hover:border-gray-500"
                        >
                            <FaTag className="text-amber-400 text-xs" />
                            <span>Today's Deals</span>
                        </button>

                        {/* Customer Service */}
                        <button
                            onClick={() => setIsSupportModalOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-[#37475A] font-medium text-gray-200 hover:text-white transition-colors cursor-pointer border border-transparent hover:border-gray-500"
                        >
                            <FaHeadset className="text-blue-400 text-xs" />
                            <span>Customer Service</span>
                        </button>

                        {/* Registry / Wishlist */}
                        <Link
                            to="/account/wishlist"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-[#37475A] font-medium text-gray-200 hover:text-white transition-colors cursor-pointer border border-transparent hover:border-gray-500"
                        >
                            <FaGift className="text-red-400 text-xs" />
                            <span>Registry & Wishlist</span>
                        </Link>

                        {/* Gift Cards / Coupons */}
                        <button
                            onClick={handleCouponsClick}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-[#37475A] font-medium text-gray-200 hover:text-white transition-colors cursor-pointer border border-transparent hover:border-gray-500"
                        >
                            <FaTicketAlt className="text-green-400 text-xs" />
                            <span>Gift Cards & Coupons</span>
                        </button>

                        {/* Sell on SwiftMart */}
                        <Link
                            to="/admin"
                            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-[#37475A] font-medium text-gray-200 hover:text-white transition-colors cursor-pointer border border-transparent hover:border-gray-500"
                        >
                            <FaStore className="text-amber-400 text-xs" />
                            <span>Sell on SwiftMart</span>
                        </Link>

                    </div>

                    {/* Right Promotional Banner */}
                    <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-amber-300 font-semibold text-xs">
                        <span>🚀 Next-Day Express Delivery Available</span>
                    </div>

                </div>
            </nav>

            {/* Slide-out Category Drawer */}
            {isCategoryDrawerOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsCategoryDrawerOpen(false)}
                    />

                    {/* Content Drawer */}
                    <div className="relative w-80 max-w-[85vw] bg-white text-gray-900 h-full shadow-2xl z-10 overflow-y-auto animate-in slide-in-from-left duration-200">
                        {/* Drawer Header */}
                        <div className="bg-[#131921] text-white p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2 font-bold text-lg">
                                <span>Hello, Browse SwiftMart</span>
                            </div>
                            <button
                                onClick={() => setIsCategoryDrawerOpen(false)}
                                className="p-1 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white"
                            >
                                <FaTimes size={18} />
                            </button>
                        </div>

                        {/* Drawer Menu Options */}
                        <div className="p-4 space-y-6">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Shop Departments</h3>
                                <div className="space-y-1">
                                    {[
                                        { name: "Electronics & Gadgets", link: "/products" },
                                        { name: "Fashion & Apparel", link: "/products" },
                                        { name: "Home & Appliances", link: "/products" },
                                        { name: "Books & Stationery", link: "/products" },
                                        { name: "All Product Catalog", link: "/products" },
                                    ].map((cat, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setIsCategoryDrawerOpen(false);
                                                navigate(cat.link);
                                            }}
                                            className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-amber-50 text-gray-800 hover:text-amber-700 font-medium text-sm transition-colors text-left"
                                        >
                                            <span>{cat.name}</span>
                                            <FaChevronRight size={12} className="text-gray-400" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Customer Account</h3>
                                <div className="space-y-1">
                                    <button
                                        onClick={() => { setIsCategoryDrawerOpen(false); navigate("/account"); }}
                                        className="w-full text-left p-2.5 rounded-lg hover:bg-gray-100 font-medium text-sm"
                                    >
                                        Your Profile & Settings
                                    </button>
                                    <button
                                        onClick={() => { setIsCategoryDrawerOpen(false); navigate("/account/orders"); }}
                                        className="w-full text-left p-2.5 rounded-lg hover:bg-gray-100 font-medium text-sm"
                                    >
                                        Track & Return Orders
                                    </button>
                                    <button
                                        onClick={() => { setIsCategoryDrawerOpen(false); navigate("/account/wishlist"); }}
                                        className="w-full text-left p-2.5 rounded-lg hover:bg-gray-100 font-medium text-sm"
                                    >
                                        Saved Wishlist Items
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Support Modal */}
            {isSupportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSupportModalOpen(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10">
                        <div className="flex items-center justify-between border-b pb-3 mb-4">
                            <div className="flex items-center gap-2 text-amber-600 font-bold text-lg">
                                <FaHeadset size={22} />
                                <span>SwiftMart Customer Support</span>
                            </div>
                            <button onClick={() => setIsSupportModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <FaTimes size={18} />
                            </button>
                        </div>
                        <p className="text-xs text-gray-600 mb-4">How can we assist you today? Select a topic below or reach out to customer service.</p>

                        <div className="space-y-2 mb-6">
                            {[
                                { title: "Track My Package", desc: "View live order status & shipping details", action: () => { setIsSupportModalOpen(false); navigate("/account/orders"); } },
                                { title: "Manage Saved Addresses", desc: "Add or update delivery locations", action: () => { setIsSupportModalOpen(false); navigate("/account/addresses"); } },
                                { title: "Returns & Refunds", desc: "Initiate return requests for purchases", action: () => { setIsSupportModalOpen(false); navigate("/account/orders"); } },
                            ].map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={item.action}
                                    className="w-full p-3 rounded-xl border hover:border-amber-500 hover:bg-amber-50/50 text-left transition-all"
                                >
                                    <h4 className="font-bold text-sm text-gray-900">{item.title}</h4>
                                    <p className="text-xs text-gray-500">{item.desc}</p>
                                </button>
                            ))}
                        </div>

                        <div className="pt-3 border-t text-center text-xs text-gray-500">
                            24/7 Helpline: <span className="font-bold text-gray-800">support@swiftmart.in</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MenuBar;