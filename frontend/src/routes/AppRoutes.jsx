import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Categories from "../pages/admin/Categories";
import Products from "../pages/admin/Products";
import CreateProduct from "../pages/admin/CreateProduct";
import EditProduct from "../pages/admin/EditProduct";
import ProductDetails from "../pages/admin/ProductDetails";

import AuthLayout from "../layouts/AuthLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {

    return (

        <BrowserRouter>

            <Routes>

                {/* Customer */}

                <Route
                    path="/"
                    element={
                        <CustomerLayout>

                            <Home />

                        </CustomerLayout>
                    }
                />

                {/* Auth */}

                <Route
                    path="/login"
                    element={
                        <AuthLayout>

                            <Login />

                        </AuthLayout>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <AuthLayout>

                            <Register />

                        </AuthLayout>
                    }
                />

                {/* Admin */}

                <Route

                  path="/admin"

                  element={

                      <ProtectedRoute>

                          <AdminLayout>

                              <Dashboard/>

                          </AdminLayout>

                      </ProtectedRoute>

                  }

                />
                <Route

                path="/admin/categories"
            
                element={
            
                    <ProtectedRoute>
            
                        <AdminLayout>
            
                            <Categories/>
            
                        </AdminLayout>
            
                    </ProtectedRoute>
            
                }
            
            />
            <Route
                path="/admin/products"
                element={
                    <ProtectedRoute>
                        <AdminLayout>
                            <Products />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/products/create"
                element={
                    <ProtectedRoute>
                        <AdminLayout>
                            <CreateProduct />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/products/:id/edit"
                element={
                    <ProtectedRoute>
                        <AdminLayout>
                            <EditProduct />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/products/:id"
                element={
                    <ProtectedRoute>
                        <AdminLayout>
                            <ProductDetails />
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />

            </Routes>

        </BrowserRouter>

    );

};

export default AppRoutes;