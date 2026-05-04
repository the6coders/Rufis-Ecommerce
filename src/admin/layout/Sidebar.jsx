import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DEFAULT_MERCHANT_ID, extractList, getCategories } from "../../api/services";


function Sidebar({ onNavigate }) {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [merchantId, setMerchantId] = useState(localStorage.getItem("merchant_id") || DEFAULT_MERCHANT_ID);

  const resolveMerchantId = async () => {
    const cachedMerchantId = localStorage.getItem("merchant_id") || DEFAULT_MERCHANT_ID;
    localStorage.setItem("merchant_id", cachedMerchantId);
    setMerchantId(cachedMerchantId);
    return cachedMerchantId;
  };

  const loadCategories = async (inputMerchantId = merchantId) => {
    if (!inputMerchantId) {
      setCategories([]);
      return;
    }

    setLoadingCategories(true);
    try {
      const response = await getCategories(inputMerchantId);
      setCategories(extractList(response.data));
    } catch {
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const currentMerchantId = await resolveMerchantId();
      if (currentMerchantId) {
        await loadCategories(currentMerchantId);
      }
    };
    init();
  }, []);

  const navItems = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/products", label: "Products" },
    { to: "/admin/categories", label: "Categories" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/create-product", label: "Create Product" },
    { to: "/admin/create-category", label: "Create Category" },
    { to: "/admin/create-user", label: "Create User" },
  ];

  return (
    <div className="w-72 max-w-full bg-gray-900 h-full text-white p-5 overflow-y-auto">

      <h1 className="text-xl font-bold mb-6">
        Admin Panel
      </h1>

      <nav className="flex flex-col gap-3">
        {navItems.map((item) => (
          <Link
            key={item.to}
            className="hover:bg-gray-700 p-2 rounded"
            to={item.to}
            onClick={onNavigate}
          >
            {item.label}
          </Link>
        ))}

      </nav>

      <div className="mt-6 border-t border-gray-700 pt-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold">Category List</h2>
          <button
            onClick={loadCategories}
            className="text-xs px-2 py-1 bg-gray-800 rounded hover:bg-gray-700"
            type="button"
          >
            Refresh
          </button>
        </div>

        {!merchantId ? (
          <p className="text-xs text-gray-400">Create merchant/product first to load categories.</p>
        ) : loadingCategories ? (
          <p className="text-xs text-gray-400">Loading...</p>
        ) : categories.length === 0 ? (
          <p className="text-xs text-gray-400">No categories found.</p>
        ) : (
          <ul className="space-y-1 max-h-56 overflow-y-auto pr-1 scrollbar-hide">
            {categories.map((category, index) => {
              const categoryKey = String(category.id || category.category_id || category._id || index);
              const imageSrc = category.image || category.icon;

              return (
                <li key={categoryKey}>
                  <Link
                    to={`/admin/products?category_id=${categoryKey}`}
                    onClick={onNavigate}
                    className="flex items-center gap-1 text-xs text-gray-200 bg-gray-800 hover:bg-gray-700 rounded px-2 py-1 truncate w-full"
                  >
                    {imageSrc ? (
                      <img src={imageSrc} alt={category.name || "Category image"} className="inline-block w-4 h-4 mr-1 object-cover rounded" />
                    ) : null}
                    {category.name || "Unnamed Category"}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

    </div>
  );
}

export default Sidebar;