import { Bell, Search } from "lucide-react";

const Header = () => {

    return (

        <header className="bg-white shadow-sm px-8 py-5 flex justify-between items-center">

            <div>

                <h1 className="text-2xl font-bold">

                    Dashboard

                </h1>

                <p className="text-gray-500">

                    Welcome back, Admin

                </p>

            </div>

            <div className="flex items-center gap-5">

                <div className="relative">

                    <Search
                        className="absolute left-3 top-3 text-gray-400"
                        size={18}
                    />

                    <input
                        className="pl-10 pr-4 py-2 rounded-lg border outline-none w-72"
                        placeholder="Search..."
                    />

                </div>

                <Bell
                    className="cursor-pointer"
                    size={22}
                />

                <img
                    src="https://ui-avatars.com/api/?name=Admin"
                    alt="Admin"
                    className="w-10 h-10 rounded-full"
                />

            </div>

        </header>

    );

};

export default Header;