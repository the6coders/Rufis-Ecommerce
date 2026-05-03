import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa6";
import { DEFAULT_MERCHANT_ID, extractList, getCart, getProducts } from "../../api/services";

function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [error, setError] = useState("");

  const parseNonNegativeNumber = (value) => {
    const cleaned = String(value ?? "").replace(/[^0-9.-]/g, "");
    const parsed = Number(cleaned);
    return Number.isNaN(parsed) || parsed < 0 ? 0 : parsed;
  };

  const formatPrice = (value) => {
    const numeric = parseNonNegativeNumber(value);
    if (numeric <= 0) return "No price";
    return `N ${numeric.toLocaleString()}`;
  };

  const normalizeCartItem = (item, index) => {
    const product = item?.product || item?.products || item?.product_details || {};
    const id = String(
      item?.id ||
      item?.cart_id ||
      item?._id ||
      item?.product_id ||
      product?.id ||
      product?.product_id ||
      product?._id ||
      index
    );

    const title = product?.title || item?.title || item?.name || "Untitled product";
    const brand = product?.brand || item?.brand || "Generic";
    const image = product?.images?.[0] || product?.image || item?.image || "";
    const quantity = Math.max(1, Number(item?.quantity || item?.qty || item?.count || 1));
    const price = parseNonNegativeNumber(product?.price ?? item?.price ?? item?.unit_price ?? 0);

    const ratingRaw = parseNonNegativeNumber(product?.rating ?? item?.rating ?? 0);
    const rating = ratingRaw > 0 ? Math.min(5, ratingRaw) : 4.2;

    const reviewsRaw = Number(product?.reviews || item?.reviews || item?.review_count || 0);
    const reviews = Number.isFinite(reviewsRaw) && reviewsRaw > 0 ? reviewsRaw : 20 + index * 7;

    return {
      id,
      title,
      brand,
      image,
      quantity,
      price,
      rating,
      reviews,
      productId: String(product?.id || product?.product_id || product?._id || item?.product_id || id),
    };
  };

  useEffect(() => {
    const userId = localStorage.getItem("user_id") || localStorage.getItem("client_user_id") || "";

    if (!userId) {
      setError("Login first to see your cart.");
      setCartItems([]);
      return;
    }

    const loadCart = async () => {
      setLoadingCart(true);
      setError("");

      try {
        const response = await getCart(userId);
        const rawList = extractList(response.data);
        setCartItems(rawList.map((item, index) => normalizeCartItem(item, index)));
      } catch {
        setError("Could not load your cart right now.");
        setCartItems([]);
      } finally {
        setLoadingCart(false);
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    const merchantId = localStorage.getItem("merchant_id") || DEFAULT_MERCHANT_ID;

    const loadSimilar = async () => {
      setLoadingSimilar(true);
      try {
        const response = await getProducts(merchantId);
        setSimilarProducts(extractList(response.data).slice(0, 8));
      } catch {
        setSimilarProducts([]);
      } finally {
        setLoadingSimilar(false);
      }
    };

    loadSimilar();
  }, []);

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const mrp = cartItems.reduce((sum, item) => sum + Math.round(item.price * 1.22) * item.quantity, 0);
    const discount = Math.max(0, mrp - subtotal);
    const delivery = subtotal > 0 ? 0 : 0;
    const total = subtotal + delivery;

    return { subtotal, mrp, discount, delivery, total };
  }, [cartItems]);

  return (
    <section className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-100 p-3 sm:p-4">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-900">My Cart</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {cartItems.length} item{cartItems.length === 1 ? "" : "s"} in your bag
        </p>
      </div>

      {loadingCart ? (
        <div className="bg-white rounded-lg border border-gray-100 p-5 text-sm text-gray-500">Loading cart...</div>
      ) : error ? (
        <div className="bg-white rounded-lg border border-red-200 p-5">
          <p className="text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-3 rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-semibold"
          >
            Go to Login
          </button>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-100 p-6 text-center">
          <p className="text-gray-600">Your cart is empty.</p>
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mt-3 rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-semibold"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {cartItems.map((item) => {
              const oldPrice = item.price > 0 ? Math.round(item.price * 1.22) : 0;
              const discountPct = oldPrice > 0 ? Math.round(((oldPrice - item.price) / oldPrice) * 100) : 0;

              return (
                <article key={item.id} className="bg-white rounded-lg border border-gray-100 p-3 sm:p-4">
                  <div className="flex gap-3">
                    <Link
                      to={`/products/${item.productId}`}
                      className="w-22 h-22 sm:w-24 sm:h-24 rounded-md overflow-hidden bg-gray-100 shrink-0"
                    >
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link to={`/products/${item.productId}`} className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.title}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">Seller: {item.brand}</p>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded bg-green-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          {item.rating.toFixed(1)} <FaStar size={9} />
                        </span>
                        <span className="text-[11px] text-gray-500">({item.reviews.toLocaleString()} ratings)</span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <p className="text-base font-semibold text-gray-900">{formatPrice(item.price)}</p>
                        {oldPrice > 0 ? <p className="text-xs text-gray-400 line-through">N {oldPrice.toLocaleString()}</p> : null}
                        {discountPct > 0 ? <p className="text-xs font-semibold text-green-600">{discountPct}% off</p> : null}
                      </div>

                      <p className="mt-1 text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <section className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">Price Details</h2>
            </div>
            <div className="px-4 py-3 space-y-2 text-sm">
              <div className="flex items-center justify-between text-gray-600">
                <span>Price ({cartItems.length} items)</span>
                <span>N {totals.mrp.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-green-600">
                <span>Discount</span>
                <span>- N {totals.discount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Delivery Charges</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="border-t border-dashed border-gray-200 pt-2 flex items-center justify-between text-base font-semibold text-gray-900">
                <span>Total Amount</span>
                <span>N {totals.total.toLocaleString()}</span>
              </div>
              <p className="text-xs text-green-600 font-medium">You will save N {totals.discount.toLocaleString()} on this order</p>
            </div>

            <div className="p-3 border-t border-gray-100 bg-white sticky bottom-0">
              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="w-full rounded-md bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 text-sm transition-colors"
              >
                PLACE ORDER
              </button>
            </div>
          </section>
        </>
      )}

      <section className="bg-white rounded-lg border border-gray-100 p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900">Similar Products</h2>
          <Link to="/products" className="text-xs font-semibold text-blue-600 hover:underline">
            View all
          </Link>
        </div>

        {loadingSimilar ? (
          <p className="text-sm text-gray-500">Loading similar products...</p>
        ) : similarProducts.length === 0 ? (
          <p className="text-sm text-gray-500">No similar products found right now.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {similarProducts.map((product, index) => {
              const productId = String(product.id || product.product_id || product._id || index);
              const imageSrc = product.images?.[0] || product.image || "";
              const ratingValue = parseNonNegativeNumber(product.rating || 4.1) || 4.1;

              return (
                <Link key={productId} to={`/products/${productId}`} className="rounded-md border border-gray-100 overflow-hidden hover:shadow-sm transition-shadow">
                  <div className="w-full h-28 bg-gray-100">
                    {imageSrc ? (
                      <img src={imageSrc} alt={product.title || "Product"} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-gray-800 line-clamp-2">{product.title || "Untitled"}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded bg-green-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        {Math.min(5, ratingValue).toFixed(1)} <FaStar size={9} />
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-gray-900">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
}

export default CartPage;
