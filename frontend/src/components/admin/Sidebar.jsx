import {
    LayoutDashboard,
    FolderTree,
    Package,
    ShoppingCart,
    Users,
    Boxes,
    Tag,
    Star,
    LogOut
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";

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
        title: "Inventory",
        path: "/admin/inventory",
        icon: Boxes
    },
    {
        title: "Coupons",
        path: "/admin/coupons",
        icon: Tag
    },
    {
        title: "Reviews",
        path: "/admin/reviews",
        icon: Star
    }
];

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <aside className="w-64 min-h-screen bg-[#131921] text-white flex flex-col">
            <div className="text-2xl font-bold p-6 border-b border-gray-700">
                SwiftMart Admin
            </div>

            <nav className="flex-1 py-2">
                {menus
                    .filter((menu) => {
                        if (user?.role === "seller") {
                            return !["Users", "Coupons", "Reviews"].includes(menu.title);
                        }
                        return true;
                    })
                    .map((menu) => {
                        const Icon = menu.icon;
                        return (
                            <NavLink
                                key={menu.path}
                                to={menu.path}
                                end={menu.path === "/admin"}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-6 py-3 transition-colors ${
                                        isActive
                                            ? "bg-[#232F3E] font-bold text-orange-400"
                                            : "hover:bg-[#232F3E] text-gray-300"
                                    }`
                                }
                            >
                                <Icon size={18} />
                                <span>{menu.title}</span>
                            </NavLink>
                        );
                    })}
            </nav>

            <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-6 hover:bg-[#232F3E] border-t border-gray-700 text-red-400"
            >
                <LogOut size={18} />
                Logout
            </button>
        </aside>
    );
};

export default Sidebar;