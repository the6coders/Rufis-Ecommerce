import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DEFAULT_MERCHANT_ID, extractList, getProducts } from "../../api/services";
import { FaArrowRightLong } from "react-icons/fa6";
import { DataContent } from "../../contexts/DataContext";

function ProductListPage() {
  const { categoryId } = useParams();
  const { searchQuery } = useContext(DataContent);
  const [merchantId, setMerchantId] = useState(localStorage.getItem("merchant_id") || DEFAULT_MERCHANT_ID);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const sliderRef = useRef(null);

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

  useEffect(() => {
    const currentMerchantId = localStorage.getItem("merchant_id") || DEFAULT_MERCHANT_ID;
    localStorage.setItem("merchant_id", currentMerchantId);
    setMerchantId(currentMerchantId);
  }, []);

  useEffect(() => {
    if (!merchantId) {
      setProducts([]);
      return;
    }

    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await getProducts(merchantId);
        setProducts(extractList(response.data));
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [merchantId]);

  const filteredProducts = useMemo(() => {
    const loweredQuery = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const directId = String(product.category_id || product.categoryId || "");
      const nestedId = String(product.category?.id || product.category?._id || "");
      const matchesCategory = !categoryId || directId === String(categoryId) || nestedId === String(categoryId);

      if (!matchesCategory) return false;
      if (!loweredQuery) return true;

      const searchableText = [
        product.title,
        product.name,
        product.brand,
        product.descp,
        product.description,
        product.category?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(loweredQuery);
    });
  }, [products, categoryId, searchQuery]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    if (filteredProducts.length <= 1) return;

    const autoSlide = () => {
      const firstItem = slider.firstElementChild;
      if (!firstItem) return;

      const itemWidth = firstItem.getBoundingClientRect().width;
      const styles = window.getComputedStyle(slider);
      const gap = parseFloat(styles.columnGap || styles.gap || "0");
      const step = itemWidth + gap;
      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
      const nextScrollLeft = slider.scrollLeft + step;

      if (nextScrollLeft >= maxScrollLeft - 1) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        slider.scrollTo({ left: nextScrollLeft, behavior: "smooth" });
      }
    };

    const intervalId = window.setInterval(autoSlide, 3000);
    return () => window.clearInterval(intervalId);
  }, [filteredProducts]);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Products</h1>
      {searchQuery.trim() ? <p className="text-sm text-gray-500 mb-3">Showing results for "{searchQuery.trim()}"</p> : null}
      {!merchantId ? <p className="text-gray-500 mb-3">Set a merchant ID first to load products.</p> : null}
      {loading ? <p className="text-gray-500 mb-3">Loading products...</p> : null}

      <div ref={sliderRef} className="flex overflow-x-auto snap-x snap-mandatory gap-5 px-2 pb-10 scrollbar-hide">
        {filteredProducts.slice(0, 10).map((product, index) => {
          const productId = String(product.id || product.product_id || product._id || index);
          return (
            <Link key={productId} to={`/products/${productId}`} className="shrink-0 snap-start">
              <article className="bg-white flex flex-col w-75 justify-center items-center gap-4 rounded-lg shadow">
                <div>
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.title || "Product image"} className="w-full h-40 object-cover rounded-2xl shadow-md" />

                  ) : (

                    <div className="w-full h-40 bg-gray-200 rounded" />
                  )}
                </div>
                {/* <p className="text-sm text-gray-500 mt-1 line-clamp-1">{product.descp || "No description"}</p> */}
              </article>
            </Link>

          );
        })}

        {!loading && filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-4 text-gray-500">No products found for this category.</div>
        ) : null}
      </div>


      {/* section 2 — Flipkart-style 2-row horizontal product grid */}



      <div className="overflow-x-auto bg-gray-50 py-5 rounded-md scrollbar-hide mt-1">
        <div className="grid grid-rows-2 grid-flow-col gap-3 w-max">
          {filteredProducts.map((product, index) => {
            const productId = String(product.id || product.product_id || product._id || index);
            return (
              <Link key={productId} to={`/products/${productId}`}>
                <div className="flex flex-col items-center w-22 rounded-md shadow pb-1 hover:shadow-md transition-shadow">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.title || "Product"}
                      className="w-20 h-15 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-20 h-15 bg-gray-200 rounded-md" />
                  )}
                  <p className="text-xs text-center mt-1 line-clamp-2 leading-normal text-gray-700 w-full">
                    {product.title || "Untitled"}
                  </p>
                </div>
              </Link>
            );
          })}

          {!loading && filteredProducts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-4 text-gray-500">No products found.</div>
          ) : null}
        </div>
      </div>


      {/* section 3 */}
      <div className="bg-gray-50 py-5 rounded-md scrollbar-hide mt-1">
        {/* suggested For You */}
        <div className="flex items-center justify-between mb-4 px-3">
          <p className="text-lg font-semibold">Suggested For You</p>
          <Link to="/products" aria-label="View more products" className="bg-blue-600 text-white text-xl rounded-full py-1 px-4 inline-flex items-center justify-center">
            <FaArrowRightLong />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredProducts.slice(0, 9).map((product, index) => {
            const productId = String(product.id || product.product_id || product._id || index);

            return (
              <Link key={productId} to={`/products/${productId}`}>
                <div className="flex flex-col rounded-lg shadow-sm pb-2 hover:shadow-md transition-shadow bg-white">

                  {/* Image */}
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.title || "Product"}
                      className="w-full h-32 sm:h-36 md:h-40 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-32 sm:h-36 md:h-40 bg-gray-200 rounded-md" />
                  )}

                  {/* Title */}
                  <p className="text-xs sm:text-sm mt-2 line-clamp-2 text-gray-700">
                    {product.title || "Untitled"}
                  </p>

                  {/* Price */}
                  <p className="text-sm font-bold mt-1 text-gray-900">
                    {formatPrice(product.price)}
                  </p>

                  {/* Tag */}
                  <p className="text-xs font-semibold mt-1 text-green-600">
                    Hot Deal
                  </p>

                </div>
              </Link>
            );
          })}

          {!loading && filteredProducts.length === 0 && (
            <div className="col-span-full bg-white rounded-lg shadow p-4 text-gray-500 text-center">
              No products found.
            </div>
          )}
        </div>


      </div>


      {/* section 5 */}
      <div className="bg-white py-5 rounded-md mt-1">
        {/* New Arrivals — horizontal list style */}
        <div className="flex items-center justify-between mb-4 px-3">
          <p className="text-lg font-semibold">New Arrivals</p>
          <Link to="/products" aria-label="View more products" className="text-blue-600 text-sm font-medium hover:underline">
            See all
          </Link>
        </div>

        <div className="flex flex-col divide-y divide-gray-100 px-3">
          {filteredProducts.slice(0, 6).map((product, index) => {
            const productId = String(product.id || product.product_id || product._id || index);
            const imageSrc = product.images?.[0] || product.image || null;
            return (
              <Link key={productId} to={`/products/${productId}`} className="flex items-center gap-4 py-3 hover:bg-gray-50 rounded-lg transition-colors px-2">
                {/* Thumbnail */}
                <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                  {imageSrc ? (
                    <img src={imageSrc} alt={product.title || "Product"} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.title || "Untitled"}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{product.brand || "Generic"}</p>
                  <p className="text-sm font-bold text-orange-600 mt-1">{formatPrice(product.price)}</p>
                </div>

                {/* Badge */}
                <span className="shrink-0 text-xs bg-blue-50 text-blue-600 font-semibold px-2 py-1 rounded-full">New</span>
              </Link>
            );
          })}

          {!loading && filteredProducts.length === 0 && (
            <p className="text-gray-500 text-sm py-4 text-center">No products found.</p>
          )}
        </div>
      </div>


      {/* section 4 */}
      <div className="bg-gray-50 py-5 rounded-md scrollbar-hide mt-1">
        {/* You May Also Like */}
        <div className="flex items-center justify-between mb-4 px-3">
          <p className="text-lg font-semibold">You May Also Like</p>
          <Link to="/products" aria-label="View more products" className="bg-blue-600 text-white text-xl rounded-full py-1 px-4 inline-flex items-center justify-center">
            <FaArrowRightLong />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredProducts.slice(0, 9).map((product, index) => {
            const productId = String(product.id || product.product_id || product._id || index);
            const price = parseNonNegativeNumber(product.price);
            const fakeOldPrice = price > 0 ? Math.round(price * 1.2) : 0;
            const discountPct = fakeOldPrice > 0 ? Math.round(((fakeOldPrice - price) / fakeOldPrice) * 100) : 0;

            return (
              <Link key={productId} to={`/products/${productId}`}>
                <div className="flex flex-col rounded-lg shadow-sm p-2 hover:shadow-md transition-shadow bg-white relative">

                  {/* Discount badge */}
                  {discountPct > 0 && (
                    <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      -{discountPct}%
                    </span>
                  )}

                  {/* Image */}
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.title || "Product"}
                      className="w-full h-32 sm:h-36 md:h-40 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-32 sm:h-36 md:h-40 bg-gray-200 rounded-md" />
                  )}

                  {/* Title */}
                  <p className="text-xs sm:text-sm mt-2 line-clamp-2 text-gray-700">
                    {product.title || "Untitled"}
                  </p>

                  {/* Price row */}
                  <div className="flex items-baseline gap-1.5 mt-1 flex-wrap">
                    <p className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</p>
                    {fakeOldPrice > 0 && (
                      <p className="text-xs text-gray-400 line-through">₦ {fakeOldPrice.toLocaleString()}</p>
                    )}
                  </div>

                  {/* Tag */}
                  <p className="text-xs font-semibold mt-1 text-green-600">
                    Best Seller
                  </p>

                </div>
              </Link>
            );
          })}

          {!loading && filteredProducts.length === 0 && (
            <div className="col-span-full bg-white rounded-lg shadow p-4 text-gray-500 text-center">
              No products found.
            </div>
          )}
        </div>


      </div>
    </div>
  );
}

      export default ProductListPage;
