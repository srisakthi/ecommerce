import {
    LayoutDashboard,
    FolderTree,
    Package,
    ShoppingCart,
    Users,
    Settings,
    LogOut
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menus = [

    {
        title: "Dashboard",
        path: "/admin",
        icon: LayoutDashboard
    },

    {
        title: "Categories",
        path: "/admin/categories",
        icon: FolderTree
    },

    {
        title: "Products",
        path: "/admin/products",
        icon: Package
    },

    {
        title: "Orders",
        path: "/admin/orders",
        icon: ShoppingCart
    },

    {
        title: "Users",
        path: "/admin/users",
        icon: Users
    },

    {
        title: "Settings",
        path: "/admin/settings",
        icon: Settings
    }

];

const Sidebar = () => {

    return (

        <aside className="w-64 h-screen bg-[#131921] text-white flex flex-col">

            <div className="text-2xl font-bold p-6 border-b border-gray-700">

                Amazon Admin

            </div>

            <nav className="flex-1">

                {

                    menus.map((menu) => {

                        const Icon = menu.icon;

                        return (

                            <NavLink

                                key={menu.path}

                                to={menu.path}

                                end={menu.path === "/admin"}

                                className={({ isActive }) =>

                                    `flex items-center gap-3 px-6 py-4 transition-colors ${
                                        isActive
                                            ? "bg-[#232F3E]"
                                            : "hover:bg-[#232F3E]"
                                    }`

                                }

                            >

                                <Icon size={18} />

                                <span>

                                    {menu.title}

                                </span>

                            </NavLink>

                        );

                    })

                }

            </nav>

            <button

                className="flex items-center gap-3 p-6 hover:bg-[#232F3E]"

            >

                <LogOut size={18} />

                Logout

            </button>

        </aside>

    );

};

export default Sidebar;