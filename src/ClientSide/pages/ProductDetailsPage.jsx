import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addToCart, extractObject, getProductById } from "../../api/services";

function ProductDetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!productId) return;

    const loadProduct = async () => {
      setLoading(true);
      setError("");
      setStatus("");

      try {
        const response = await getProductById(productId);
        const data = extractObject(response.data);
        setProduct(data);

        const firstImage = data?.images?.[0] || data?.image || "";
        setActiveImage(firstImage);
      } catch {
        setError("Could not load this product right now. Please try again.");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const galleryImages = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) return product.images;
    return product.image ? [product.image] : [];
  }, [product]);

  const priceNumber = Number(product?.price);
  const hasValidPrice = Number.isFinite(priceNumber) && priceNumber > 0;
  const priceValue = hasValidPrice ? `₦ ${priceNumber.toLocaleString()}` : "No price";
  const fakeOldPrice = hasValidPrice ? Math.round(priceNumber * 1.15) : 0;
  const maxQty = Math.max(1, Number(product?.quantity || 1));
  const discountPct = fakeOldPrice > 0 ? Math.max(1, Math.round(((fakeOldPrice - priceNumber) / fakeOldPrice) * 100)) : 0;

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("user_id") || localStorage.getItem("client_user_id") || "";
    const resolvedProductId = product?.id || product?.product_id || product?._id || productId;

    if (!userId) {
      setStatus("Set a user ID in localStorage (key: user_id) before adding to cart.");
      return;
    }

    setAddingToCart(true);
    setStatus("");

    try {
      await addToCart({
        user_id: userId,
        product_id: resolvedProductId,
        quantity,
      });
      setStatus("Added to cart successfully.");
    } catch (err) {
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        err?.message ||
        "Failed to add product to cart.";
      setStatus(`Add to cart failed: ${apiMessage}`);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-white rounded-xl shadow p-6">
        <p className="text-gray-500">Loading product details...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white rounded-xl shadow p-6">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 bg-gray-900 text-white px-4 py-2 rounded"
        >
          Back to products
        </button>
      </section>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="text-sm text-gray-500">
        <Link to="/products" className="hover:text-orange-600">Products</Link> / <span>{product.title || "Product details"}</span>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5 p-5 border-b lg:border-b-0 lg:border-r border-gray-100">
            <div className="bg-gray-50 rounded-lg border border-gray-100 p-4 flex items-center justify-center min-h-72">
              {activeImage ? (
                <img src={activeImage} alt={product.title || "Product"} className="max-h-72 object-contain" />
              ) : (
                <div className="w-full h-72 bg-gray-200 rounded" />
              )}
            </div>

            {galleryImages.length > 1 ? (
              <div className="grid grid-cols-5 gap-2 mt-3">
                {galleryImages.slice(0, 5).map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    className={`rounded border p-1 bg-white ${activeImage === image ? "border-orange-500" : "border-gray-200"}`}
                    onClick={() => setActiveImage(image)}
                  >
                    <img src={image} alt={`Preview ${index + 1}`} className="h-14 w-full object-cover rounded" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-5 p-5 border-b lg:border-b-0 lg:border-r border-gray-100">
            <div className="inline-block text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded bg-orange-100 text-orange-700">
              Official Store
            </div>
            <h1 className="mt-3 text-2xl font-bold text-gray-900">{product.title || "Untitled product"}</h1>
            <p className="mt-2 text-sm text-gray-500">Brand: <span className="text-gray-700 font-medium">{product.brand || "Generic"}</span></p>

            <div className="mt-4 p-3 rounded-lg bg-orange-50 border border-orange-100">
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-bold text-gray-900">{priceValue}</p>
                {hasValidPrice ? <p className="text-sm text-gray-400 line-through">N {fakeOldPrice.toLocaleString()}</p> : null}
                {discountPct > 0 ? <span className="text-xs bg-orange-600 text-white px-2 py-0.5 rounded">-{discountPct}%</span> : null}
              </div>
              <p className="text-xs text-gray-500 mt-1">Inclusive of VAT where applicable</p>
            </div>

            <div className="mt-4">
              <h2 className="text-sm font-semibold text-gray-900">Description</h2>
              <p className="text-sm text-gray-600 mt-1 leading-6">
                {product.descp || "No detailed description available for this product yet."}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded border border-gray-200 p-3">
                <p className="text-gray-400">Stock</p>
                <p className="font-semibold text-gray-800">{product.quantity ?? 0} units</p>
              </div>
              <div className="rounded border border-gray-200 p-3">
                <p className="text-gray-400">Shipping</p>
                <p className="font-semibold text-gray-800">Nationwide delivery</p>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-2 p-5 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">Quantity</h2>
            <div className="mt-2 flex items-center gap-2">
              <button
                className="w-8 h-8 rounded bg-white border border-gray-300"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <span className="min-w-8 text-center font-semibold">{quantity}</span>
              <button
                className="w-8 h-8 rounded bg-white border border-gray-300"
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded transition-colors disabled:opacity-60"
            >
              {addingToCart ? "Adding..." : "Add to cart"}
            </button>

            <button
              onClick={() => navigate("/checkout")}
              className="mt-2 w-full bg-white text-orange-600 border border-orange-300 font-semibold py-2.5 rounded"
            >
              Buy now
            </button>

            {status ? <p className="text-xs mt-3 text-gray-600">{status}</p> : null}
          </aside>
        </div>
      </div>
    </section>
  );
}

export default ProductDetailsPage;
