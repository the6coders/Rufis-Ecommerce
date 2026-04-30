import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DEFAULT_MERCHANT_ID, extractList, getProducts } from "../../api/services";
import { FaArrowRightLong } from "react-icons/fa6";

function ProductListPage() {
  const { categoryId } = useParams();
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
    if (!categoryId) return products;

    return products.filter((product) => {
      const directId = String(product.category_id || product.categoryId || "");
      const nestedId = String(product.category?.id || product.category?._id || "");
      return directId === String(categoryId) || nestedId === String(categoryId);
    });
  }, [products, categoryId]);

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

        <div className="grid grid-rows-2 grid-cols-3 gap-5 w-max">
          {filteredProducts.slice(0, 9).map((product, index) => {
            const productId = String(product.id || product.product_id || product._id || index);
            return (
              <Link key={productId} to={`/products/${productId}`}>
                <div className="flex flex-col items-start w-26 rounded-md shadow pb-1 hover:shadow-md transition-shadow">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.title || "Product"}
                      className="w-28 h-28 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-28 h-28 bg-gray-200 rounded-md" />
                  )}
                  <p className="text-xs text-left pl-2 mt-1 line-clamp-2 leading-normal text-gray-700 w-full">
                    {product.title || "Untitled"}
                  </p>
                  <p className="text-xs text-left pl-2 font-bold mt-1 line-clamp-2 leading-normal text-gray-700 w-full">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-xs text-left pl-2 font-bold mt-1 line-clamp-2 leading-normal text-green-600 w-full">
                    Hot Deal
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


    </div>
  );
}

export default ProductListPage;
