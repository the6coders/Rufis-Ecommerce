import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DEFAULT_MERCHANT_ID, extractList, getProducts } from "../../api/services";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const parseNonNegativeNumber = (value) => {
    const cleaned = String(value ?? "").replace(/[^0-9.-]/g, "");
    const parsed = Number(cleaned);
    return Number.isNaN(parsed) || parsed < 0 ? 0 : parsed;
  };

  const formatPrice = (value) => {
    const numeric = parseNonNegativeNumber(value);
    if (numeric <= 0) return "No price";
    return `₦ ${numeric.toLocaleString()}`;
  };

  const getImage = (product) => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      const img = product.images[0];
      if (typeof img === "string") return img;
      return img?.url || img?.secure_url || img?.src || "";
    }
    return product.image || product.image_url || product.thumbnail || "";
  };

  useEffect(() => {
    const merchantId = localStorage.getItem("merchant_id") || DEFAULT_MERCHANT_ID;
    setLoading(true);
    getProducts(merchantId)
      .then((res) => setProducts(extractList(res.data)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-base font-bold text-gray-800">For You</h2>
        <Link to="/products" className="text-xs text-blue-600 font-semibold hover:underline">
          View all
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-100 p-3 animate-pulse">
              <div className="w-full h-36 bg-gray-200 rounded-md mb-2" />
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-1" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-100 p-6 text-center text-sm text-gray-500">
          No products available right now.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {products.map((product, index) => {
            const productId = String(product.id || product.product_id || product._id || index);
            const image = getImage(product);
            const price = formatPrice(product.price ?? product.amount ?? product.selling_price ?? 0);

            return (
              <Link key={productId} to={`/products/${productId}`}>
                <article className="bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
                  {image ? (
                    <img
                      src={image}
                      alt={product.title || product.name || "Product"}
                      className="w-full h-36 object-cover"
                    />
                  ) : (
                    <div className="w-full h-36 bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                      No image
                    </div>
                  )}
                  <div className="p-2">
                    <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug">
                      {product.title || product.name || "Untitled"}
                    </p>
                    <p className="text-sm font-bold text-gray-900 mt-1">{price}</p>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default HomePage;
