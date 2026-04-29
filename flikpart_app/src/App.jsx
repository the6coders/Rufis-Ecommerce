import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "./admin/layout/AdminLayout";
import ClientLayout from "./ClientSide/layout/ClientLayout";

import Dashboard from "./admin/pages/Dashboard";
import Products from "./admin/pages/Products";
import Categories from "./admin/pages/Categories";
import Users from "./admin/pages/Users";
import CreateProduct from "./admin/pages/CreateProduct";
import CreateCategory from "./admin/pages/CreateCategory";
import CreateUser from "./admin/pages/CreateUser";
import HomePage from "./ClientSide/pages/HomePage";
import ProductListPage from "./ClientSide/pages/ProductListPage";
import ProductDetailsPage from "./ClientSide/pages/ProductDetailsPage";
import CartPage from "./ClientSide/pages/CartPage";
import CheckoutPage from "./ClientSide/pages/CheckoutPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* CLIENT ROUTES WRAPPED IN LAYOUT */}

        <Route
          path="/"
          element={
            <ClientLayout>
              <HomePage />
            </ClientLayout>
          }
        />

        <Route
          path="/products"
          element={
            <ClientLayout>
              <ProductListPage />
            </ClientLayout>
          }
        />

        <Route
          path="/products/:productId"
          element={
            <ClientLayout>
              <ProductDetailsPage />
            </ClientLayout>
          }
        />

        <Route
          path="/cart"
          element={
            <ClientLayout>
              <CartPage />
            </ClientLayout>
          }
        />

        <Route
          path="/checkout"
          element={
            <ClientLayout>
              <CheckoutPage />
            </ClientLayout>
          }
        />

{/* CLIENT CATEGORY ROUTES WRAPPED IN LAYOUT */}
        <Route
          path="/categories/:categoryId"
          element={
            <ClientLayout>
              <ProductListPage />
            </ClientLayout>
          }
        />
        

        {/* ADMIN ROUTES WRAPPED IN LAYOUT */}

        <Route path="/admin" element={<AdminLayout> <Dashboard /> </AdminLayout>} />

        <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />

        <Route
          path="/admin/products"
          element={
            <AdminLayout>
              <Products />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminLayout>
              <Users />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <AdminLayout>
              <Categories />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/create-product"
          element={
            <AdminLayout>
              <CreateProduct />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/create-category"
          element={
            <AdminLayout>
              <CreateCategory />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/create-user"
          element={
            <AdminLayout>
              <CreateUser />
            </AdminLayout>
          }
        />

        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;