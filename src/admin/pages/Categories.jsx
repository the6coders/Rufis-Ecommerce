import { useEffect, useState } from "react";
import { DEFAULT_MERCHANT_ID, deleteCategory, extractList, getCategories } from "../../api/services";


function Categories() {
  const [merchantId, setMerchantId] = useState(localStorage.getItem("merchant_id") || DEFAULT_MERCHANT_ID);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  const resolveMerchantId = async () => {
    const cachedMerchantId = localStorage.getItem("merchant_id") || DEFAULT_MERCHANT_ID;
    localStorage.setItem("merchant_id", cachedMerchantId);
    setMerchantId(cachedMerchantId);
    return cachedMerchantId;
  };


  const Delete = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return;
    }
    try {
      const resp = await deleteCategory(categoryId);
      if (resp.status === 200) {
        setCategories((prev) => prev.filter((cat) => String(cat.id || cat.category_id || cat._id) !== String(categoryId)));
      } else {
        setError("Failed to delete category. Please try again.");
      }
      loadCategories();
    } catch {
      setError("Could not delete category. Please try again.");
    }
  };

  const loadCategories = async (inputMerchantId = merchantId) => {
    if (!inputMerchantId) {
      setCategories([]);
      setError("Please provide a merchant ID.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getCategories(inputMerchantId);
      setCategories(extractList(response.data));
      localStorage.setItem("merchant_id", String(inputMerchantId));
    } catch {
      setCategories([]);
      setError("Could not load categories. Confirm merchant ID and retry.");
    } finally {
      setLoading(false);
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

  return (
    <div className="space-y-4 overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold">Categories</h1>

      <div className="bg-white p-4 rounded shadow mb-5 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-end gap-3">
        <div className="w-full sm:w-auto">
          <label className="block text-sm mb-1">Merchant ID</label>
          <input
            className="border rounded px-3 py-2 w-full sm:min-w-64 bg-gray-100 text-gray-600 cursor-not-allowed"
            value={merchantId}
            readOnly
            aria-readonly="true"
            title="Merchant ID is locked"
          />
        </div>

        <button onClick={loadCategories} className="bg-gray-900 text-white px-4 py-2 rounded w-full sm:w-auto" type="button">
          Load Categories
        </button>
      </div>

      {error ? <p className="mb-4 rounded bg-red-100 text-red-700 px-3 py-2">{error}</p> : null}
      {loading ? <p>Loading categories...</p> : null}

      <div className="bg-white rounded shadow overflow-hidden">
        {categories.length === 0 && !loading ? (
          <div className="p-4 text-gray-500">No categories found.</div>
        ) : (
          <ul className="divide-y">
            {categories.map((category, index) => {
              console.log("Category item:", category);
              const categoryId = String(category.id || category.category_id || category._id || index);
              const imageSrc = category.image || category.icon;


              return (
                <li key={categoryId} className="p-4">
                  <div className="flex items-center gap-3">
                    {imageSrc ? <img src={imageSrc} alt={category.name || "Category image"} className="w-12 h-12 object-cover rounded" /> : null}
                    <div className="min-w-0">
                      <p className="font-medium">{category.name || "Unnamed Category"}</p>
                      <p className="text-xs text-gray-500 truncate">ID: {categoryId}</p>
                      <button
                        onClick={() => Delete(categoryId)}
                        className="bg-red-500 text-white text-sm mt-1 px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Categories;
