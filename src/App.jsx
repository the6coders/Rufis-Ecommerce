import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

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
import AllCategories from "./ClientSide/pages/AllCategories";
import ProfilePage from "./ClientSide/pages/ProfilePage";
import LoginPage from "./ClientSide/pages/LoginPage";
import SignupPage from "./ClientSide/pages/SignupPage";

function App() {
  const getInitialTheme = () => {
    if (typeof window === "undefined") return "light";

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <BrowserRouter>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        className="fixed top-4 right-4 z-[70] rounded-full border border-gray-300 bg-white/95 px-4 py-2 text-xs font-semibold text-gray-800 shadow-md backdrop-blur hover:bg-gray-50 transition-colors"
      >
        {theme === "dark" ? "Light mode" : "Dark mode"}
      </button>
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
          path="/allcategories"
          element={<AllCategories />}
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

        <Route
          path="/profile"
          element={<ProfilePage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/signup"
          element={<SignupPage />}
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