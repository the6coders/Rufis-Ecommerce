import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DEFAULT_MERCHANT_ID, extractList, getCategories } from "../../api/services";
import Footer from "../components/footer";

function AllCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      const merchantId = localStorage.getItem("merchant_id") || DEFAULT_MERCHANT_ID;
      localStorage.setItem("merchant_id", merchantId);

      if (!merchantId) {
        setCategories([]);
        return;
      }

      setLoading(true);
      try {
        const response = await getCategories(merchantId);
        setCategories(extractList(response.data));
      } catch {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-[calc(5rem+env(safe-area-inset-bottom))]">
      <main className="max-w-3xl mx-auto px-4 py-6">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">All Categories</h1>
            <p className="text-sm text-gray-500">{categories.length} found</p>
          </div>

          {loading ? <p className="text-gray-500">Loading categories...</p> : null}

          {!loading && categories.length === 0 ? (
            <p className="text-sm text-gray-500 px-1 py-2">No categories found yet.</p>
          ) : null}

          <div className="flex flex-col gap-2">
            {categories.map((cat, index) => {
              const categoryId = String(cat.id || cat.category_id || cat._id || index);
              const imageSrc = cat.image || cat.icon || "";

              return (
                <Link
                  key={categoryId}
                  to={`/categories/${categoryId}`}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                    {imageSrc ? (
                      <img src={imageSrc} alt={cat.name || "Category"} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-gray-200" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                      {cat.name || "Category"}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Tap to browse products</p>
                  </div>

                  <span className="text-gray-400 text-lg">&rsaquo;</span>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AllCategories;
