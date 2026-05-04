import axios from "axios";

const BASE_URL = "/api";
export const DEFAULT_MERCHANT_ID = "69e6b6e31595cbe810463ef4";

const api = axios.create({
  baseURL: BASE_URL,
});

export const extractList = (responseData) => {
  const visited = new Set();

  const dig = (value, depth = 0) => {
    if (!value || depth > 3) return [];
    if (Array.isArray(value)) return value;
    if (typeof value !== "object") return [];
    if (visited.has(value)) return [];

    visited.add(value);

    const directKeys = ["data", "results", "items", "categories", "products", "users", "carts"];
    for (const key of directKeys) {
      if (Array.isArray(value?.[key])) return value[key];
    }

    for (const key of directKeys) {
      const nested = dig(value?.[key], depth + 1);
      if (nested.length) return nested;
    }

    for (const nestedValue of Object.values(value)) {
      const nested = dig(nestedValue, depth + 1);
      if (nested.length) return nested;
    }

    return [];
  };

  return dig(responseData);
};

export const extractObject = (responseData) => {
  if (!responseData || typeof responseData !== "object") return {};
  if (responseData.data && typeof responseData.data === "object" && !Array.isArray(responseData.data)) {
    return responseData.data;
  }
  return responseData;
};

export const sortCategoriesForDisplay = (categories) => {
  const list = Array.isArray(categories) ? [...categories] : [];

  return list.sort((left, right) => {
    const leftName = String(left?.name || "").trim().toLowerCase();
    const rightName = String(right?.name || "").trim().toLowerCase();

    if (leftName === "for you" && rightName !== "for you") return -1;
    if (rightName === "for you" && leftName !== "for you") return 1;

    return leftName.localeCompare(rightName);
  });
};

// 🔹 CREATE MERCHANT (run once if needed)
export const createMerchant = async (merchantData) => await api.post("/merchants", merchantData);

export const loginMerchant = async (loginData) => await api.post("/merchants/login", loginData);

export const updateMerchant = async (merchantId, merchantData) =>
  await api.put(`/merchants/${merchantId}`, merchantData);

export const changeMerchantPassword = async (merchantId, passwordData) =>
  await api.put(`/merchants/${merchantId}/change-passwd`, passwordData);

// 🔹 GET PRODUCTS
export const getProducts = async (merchantId, categoryId) => {
  const url = categoryId
    ? `/products?merchant_id=${merchantId}&category_id=${categoryId}`
    : `/products?merchant_id=${merchantId}`;
  return api.get(url);
};

export const getProductById = async (productId) => await api.get(`/products/${productId}`);

export const createProduct = async (productData) => await api.post("/products", productData);

export const updateProduct = async (productId, productData) =>
  await api.put(`/products/${productId}`, productData);

export const deleteProduct = async (productId) => await api.delete(`/products/${productId}`);

// 🔹 GET CATEGORIES

export const getCategories = async (merchantId) =>
  await api.get(`/categories?merchant_id=${merchantId}`);

export const createCategory = async (categoryData) => await api.post("/categories", categoryData);

export const updateCategory = async (categoryId, categoryData) =>
  await api.put(`/categories/${categoryId}`, categoryData);

export const deleteCategory = async (categoryId) => await api.delete(`/categories/${categoryId}`);

// 🔹 GET CART
export const getCart = async (userId) =>
  await api.get(`/carts?user_id=${userId}`);

export const addToCart = async (cartData) => await api.post("/carts", cartData);

export const removeFromCart = async (userId, productId) =>
  await api.post("/carts", { user_id: userId, product_id: productId, quantity: 0 });

export const checkoutCart = async (checkoutData) => await api.post("/carts/checkout", checkoutData);

// 🔹 GET USERS
export const getUsers = async () => await api.get("/users");

export const loginUser = async (loginData) => await api.post("/users/login", loginData);

export const createUser = async (userData) => await api.post("/users", userData);

export const updateUser = async (userId, userData) => await api.put(`/users/${userId}`, userData);

export const deleteUser = async (userId) =>
  await api.delete("/users", {
    data: { user_id: userId },
  });