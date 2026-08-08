import {
    FaShoppingCart,
    FaSearch,
    FaMapMarkerAlt
} from "react-icons/fa";

const Header = () => {

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

                    <span className="font-bold">

                        Cart

                    </span>

                </div>

            </div>

        </header>

    );

};

export default Header;