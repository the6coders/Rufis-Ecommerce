import { useEffect, useState } from "react";
import { getUsers, getCart, extractList } from "../../api/services";

function Cart() {
  const [cartRows, setCartRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAllCarts = async () => {
      setLoading(true);
      try {
        const usersRes = await getUsers();
        const users = extractList(usersRes.data);

        const results = await Promise.allSettled(
          users.map((u) => getCart(u._id || u.id))
        );

        const rows = [];
        results.forEach((result, idx) => {
          if (result.status === "fulfilled") {
            const items = extractList(result.value?.data);
            const user = users[idx];
            items.forEach((item) => {
              rows.push({
                userId: user._id || user.id,
                userEmail: user.email || "—",
                userName: user.name || user.username || "—",
                productId: item.product_id || item.productId || "—",
                title: item.title || item.name || item.product_name || "—",
                qty: item.quantity ?? item.qty ?? 1,
                price: item.price ?? item.unit_price ?? "—",
              });
            });
          }
        });

        setCartRows(rows);
      } catch (err) {
        setError("Failed to load cart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllCarts();
  }, []);

  const filtered = cartRows.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.userEmail.toLowerCase().includes(q) ||
      r.userName.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.productId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        All User Carts
      </h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by user, product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading && (
        <p className="text-gray-500 dark:text-gray-400 text-sm">Loading carts…</p>
      )}
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {!loading && !error && (
        <>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {filtered.length} item{filtered.length !== 1 ? "s" : ""} found
          </p>
          <div className="overflow-x-auto rounded-xl shadow">
            <table className="min-w-full bg-white dark:bg-gray-800 text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Product ID</th>
                  <th className="px-4 py-3 text-center">Qty</th>
                  <th className="px-4 py-3 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-gray-400 dark:text-gray-500"
                    >
                      No cart items found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((row, i) => (
                    <tr
                      key={i}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-800 dark:text-gray-100 font-medium">
                        {row.userName}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                        {row.userEmail}
                      </td>
                      <td className="px-4 py-3 text-gray-800 dark:text-gray-100 max-w-[180px] truncate">
                        {row.title}
                      </td>
                      <td className="px-4 py-3 text-gray-400 dark:text-gray-500 font-mono text-xs">
                        {row.productId}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-200">
                        {row.qty}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-800 dark:text-gray-100 font-semibold">
                        {row.price !== "—"
                          ? `₹${Number(row.price).toLocaleString("en-IN")}`
                          : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;