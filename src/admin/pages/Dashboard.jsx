import { useEffect, useState } from "react";
import {
  DEFAULT_MERCHANT_ID,
  extractList,
  getCart,
  getProducts,
  getUsers,
} from "../../api/services";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [cart, setCart] = useState([]);
  const [merchantId, setMerchantId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const resolveMerchantId = async () => {
    const cachedMerchantId = localStorage.getItem("merchant_id") || DEFAULT_MERCHANT_ID;
    localStorage.setItem("merchant_id", cachedMerchantId);
    setMerchantId(cachedMerchantId);
    return cachedMerchantId;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const currentMerchantId = await resolveMerchantId();
        const [productRes, userRes] = await Promise.all([
          getProducts(currentMerchantId),
          getUsers(),
        ]);

        const loadedProducts = extractList(productRes.data);
        const loadedUsers = extractList(userRes.data);

        setProducts(loadedProducts);
        setUsers(loadedUsers);

        const userIds = loadedUsers
          .map((user) => user?.id || user?.user_id || user?._id)
          .filter(Boolean)
          .map((id) => String(id));

        if (userIds.length === 0) {
          setCart([]);
          return;
        }

        try {
          const cartResponses = await Promise.allSettled(
            userIds.map((userId) => getCart(userId))
          );

          const mergedCartItems = cartResponses
            .filter((result) => result.status === "fulfilled")
            .flatMap((result) => extractList(result.value.data));

          setCart(mergedCartItems);
        } catch {
          setCart([]);
        }
      } catch (err) {
        console.log("Dashboard error:", err);
        setError("Unable to fetch dashboard metrics now. Please refresh shortly.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const previewProducts = products.slice(0, 10);

  if (loading) {
    return <p className="p-5">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-5">Merchant ID: {(merchantId || "N/A").slice(0, 8)}.......</p>

      {error ? (
        <p className="mb-5 rounded bg-red-100 text-red-700 px-3 py-2">{error}</p>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Total Products</h2>
          <p className="text-3xl font-bold">{products.length}</p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Cart Items</h2>
          <p className="text-3xl font-bold">{cart.length}</p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Users</h2>
          <p className="text-3xl font-bold">{users.length}</p>
        </div>
      </div>

      <div className="bg-white rounded shadow mt-6 overflow-x-auto">
        <div className="px-5 py-4 border-b">
          <h2 className="text-lg font-semibold">Latest Products (Top 10)</h2>
        </div>

        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3">Brand</th>
              <th className="text-left px-4 py-3">Price</th>
              <th className="text-left px-4 py-3">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {previewProducts.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-gray-500" colSpan={4}>
                  No products found.
                </td>
              </tr>
            ) : (
              previewProducts.map((product, index) => (
                <tr key={product.id || product.product_id || product._id || index} className="border-t">
                  <td className="px-4 py-3">{product.title || "Untitled"}</td>
                  <td className="px-4 py-3">{product.brand || "-"}</td>
                  <td className="px-4 py-3">
                   NGN {product.price || "Untitled product"}
                  </td>
                  <td className="px-4 py-3">{product.quantity ?? 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default Dashboard;