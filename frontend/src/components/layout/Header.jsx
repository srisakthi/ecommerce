import {
    FaShoppingCart,
    FaSearch,
    FaMapMarkerAlt
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();

    const cartItems = useSelector(
        (state) => state.cart.items
    );
    const cartCount = cartItems.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );


    return (

        <header className="bg-[#131921] text-white">

            <div className="max-w-[1500px] mx-auto flex items-center gap-4 px-5 py-3">

                {/* Logo */}

                <h1 className="text-3xl font-bold">

                    amazon

                </h1>

                {/* Location */}

                <div className="hidden md:flex items-center">

                    <FaMapMarkerAlt/>

                    <div className="ml-2">

                        <p className="text-xs">

                            Deliver to

                        </p>

                        <h3 className="font-semibold">

                            India

                        </h3>

                    </div>

                </div>

                {/* Search */}

                <div className="flex flex-1">

                    <input

                        className="flex-1 px-4 py-2 text-black outline-none"

                        placeholder="Search Amazon"

                    />

                    <button className="bg-yellow-400 px-5">

                        <FaSearch/>

                    </button>

                </div>

                {/* Account */}

                <div>

                    <p className="text-xs">

                        Hello, Sign In

                    </p>

                    <h3 className="font-bold">

                        Account

                    </h3>

                </div>

                {/* Orders */}

                <div>

                    <p className="text-xs">

                        Returns

                    </p>

                    <h3 className="font-bold">

                        & Orders

                    </h3>

                </div>

                {/* Cart */}

                <div className="flex items-center">

                    <FaShoppingCart
                        className="text-3xl"
                    />
                    <button
                        type="button"
                        onClick={() => navigate("/cart")}
                        className="relative flex items-center gap-1 text-white"
                    >
                        <span className="text-2xl">
                            🛒
                        </span>

                        <span>
                            Cart
                        </span>

                        {cartCount > 0 && (
                            <span
                                className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF9900] px-1 text-xs font-bold text-black"
                            >
                                {cartCount}
                            </span>
                        )}
                    </button>

                </div>

            </div>

        </header>

    );

};

export default Header;