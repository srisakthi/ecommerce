import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Categories from "../pages/admin/Categories";
import Products from "../pages/admin/Products";
import CreateProduct from "../pages/admin/CreateProduct";
import EditProduct from "../pages/admin/EditProduct";
import ProductDetails from "../pages/admin/ProductDetails";
import AdminUsers from "../pages/admin/Users";
import AdminOrders from "../pages/admin/Orders";
import AdminInventory from "../pages/admin/Inventory";
import AdminCoupons from "../pages/admin/Coupons";
import AdminReviews from "../pages/admin/Reviews";

import CustomerProducts from "../pages/Products/Products";
import CustomerProductDetails from "../pages/ProductDetails/ProductDetails";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import OrderConfirmation from "../pages/Checkout/OrderConfirmation";
import Account from "../pages/Account/Account";
import Addresses from "../pages/Account/Addresses";
import MyOrders from "../pages/Orders/MyOrders";
import OrderDetails from "../pages/Orders/OrderDetails";
import Wishlist from "../pages/Wishlist/Wishlist";

import AuthLayout from "../layouts/AuthLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Customer Routes */}
                <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
                <Route path="/products" element={<CustomerLayout><CustomerProducts /></CustomerLayout>} />
                <Route path="/products/:id" element={<CustomerLayout><CustomerProductDetails /></CustomerLayout>} />
                <Route path="/cart" element={<CustomerLayout><Cart /></CustomerLayout>} />
                
                {/* Protected Customer Routes */}
                <Route path="/checkout" element={<ProtectedRoute><CustomerLayout><Checkout /></CustomerLayout></ProtectedRoute>} />
                <Route path="/order-confirmation/:id" element={<ProtectedRoute><CustomerLayout><OrderConfirmation /></CustomerLayout></ProtectedRoute>} />
                <Route path="/account" element={<ProtectedRoute><CustomerLayout><Account /></CustomerLayout></ProtectedRoute>} />
                <Route path="/account/addresses" element={<ProtectedRoute><CustomerLayout><Addresses /></CustomerLayout></ProtectedRoute>} />
                <Route path="/account/orders" element={<ProtectedRoute><CustomerLayout><MyOrders /></CustomerLayout></ProtectedRoute>} />
                <Route path="/account/orders/:id" element={<ProtectedRoute><CustomerLayout><OrderDetails /></CustomerLayout></ProtectedRoute>} />
                <Route path="/account/wishlist" element={<ProtectedRoute><CustomerLayout><Wishlist /></CustomerLayout></ProtectedRoute>} />

                {/* Auth Routes */}
                <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
                <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />

                {/* Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin', 'seller']}><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/categories" element={<ProtectedRoute allowedRoles={['admin', 'seller']}><AdminLayout><Categories /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/products" element={<ProtectedRoute allowedRoles={['admin', 'seller']}><AdminLayout><Products /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/products/create" element={<ProtectedRoute allowedRoles={['admin', 'seller']}><AdminLayout><CreateProduct /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/products/:id/edit" element={<ProtectedRoute allowedRoles={['admin', 'seller']}><AdminLayout><EditProduct /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/products/:id" element={<ProtectedRoute allowedRoles={['admin', 'seller']}><AdminLayout><ProductDetails /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminUsers /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={['admin', 'seller']}><AdminLayout><AdminOrders /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/inventory" element={<ProtectedRoute allowedRoles={['admin', 'seller']}><AdminLayout><AdminInventory /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/coupons" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminCoupons /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/reviews" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminReviews /></AdminLayout></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;