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
import Cart from "./admin/pages/Cart";
import HomePage from "./ClientSide/pages/HomePage";
import ProductListPage from "./ClientSide/pages/ProductListPage";
import ProductDetailsPage from "./ClientSide/pages/ProductDetailsPage";
import CartPage from "./ClientSide/pages/CartPage";
import CheckoutPage from "./ClientSide/pages/CheckoutPage";
import AllCategories from "./ClientSide/pages/AllCategories";
import ProfilePage from "./ClientSide/pages/ProfilePage";
import LoginPage from "./ClientSide/pages/LoginPage";
import SignupPage from "./ClientSide/pages/SignupPage";
import SplashPage from "./ClientSide/pages/SplashPage";

const ONBOARDING_VERSION = "v2";

function App() {
  const [hasSeenSplash, setHasSeenSplash] = useState(
    () => localStorage.getItem("onboarding_seen_version") === ONBOARDING_VERSION
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const theme =
      savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, []);

  const handleSplashFinish = () => {
    localStorage.setItem("onboarding_seen_version", ONBOARDING_VERSION);
    setHasSeenSplash(true);
  };

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/splash"
          element={<SplashPage onFinish={handleSplashFinish} />}
        />

        {/* CLIENT ROUTES WRAPPED IN LAYOUT */}

        <Route
          path="/"
          element={
            hasSeenSplash ? (
              <ClientLayout>
                <HomePage />
              </ClientLayout>
            ) : (
              <Navigate to="/splash" replace />
            )
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
            <ClientLayout showNavbar={false} showCategories={false}>
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
          path="/admin/cart"
          element={
            <AdminLayout>
              <Cart />
            </AdminLayout>
          }
        />

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