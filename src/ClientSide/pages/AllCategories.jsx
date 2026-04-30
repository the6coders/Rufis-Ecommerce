import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    DEFAULT_MERCHANT_ID,
    extractList,
    getCategories,
    getProducts,
} from "../../api/services";
import Footer from "../components/footer";

function AllCategories() {
    const [merchantId, setMerchantId] = useState(
        localStorage.getItem("merchant_id") || DEFAULT_MERCHANT_ID
    );
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const parseNonNegativeNumber = (value) => {
        const cleaned = String(value ?? "").replace(/[^0-9.-]/g, "");
        const parsed = Number(cleaned);
        return Number.isNaN(parsed) || parsed < 0 ? 0 : parsed;
    };

    const formatPrice = (value) => {
        const numeric = parseNonNegativeNumber(value);
        if (numeric <= 0) return "No price";
        return `NGN ${numeric.toLocaleString()}`;
    };

    useEffect(() => {
        const currentMerchantId =
            localStorage.getItem("merchant_id") || DEFAULT_MERCHANT_ID;
        localStorage.setItem("merchant_id", currentMerchantId);
        setMerchantId(currentMerchantId);
    }, []);

    useEffect(() => {
        const loadCategories = async () => {
            if (!merchantId) return;

            setLoadingCategories(true);
            try {
                const response = await getCategories(merchantId);
                const list = extractList(response.data);
                setCategories(list);

                if (list.length > 0) {
                    const firstCategoryId = String(
                        list[0].id || list[0].category_id || list[0]._id || ""
                    );
                    setSelectedCategoryId((prev) => prev || firstCategoryId);
                }
            } catch {
                setCategories([]);
            } finally {
                setLoadingCategories(false);
            }
        };

        loadCategories();
    }, [merchantId]);

    useEffect(() => {
        const loadProductsForCategory = async () => {
            if (!merchantId || !selectedCategoryId) return;

            setLoadingProducts(true);
            try {
                const response = await getProducts(
                    merchantId,
                    selectedCategoryId
                );
                setProducts(extractList(response.data));
            } catch {
                setProducts([]);
            } finally {
                setLoadingProducts(false);
            }
        };

        loadProductsForCategory();
    }, [merchantId, selectedCategoryId]);

    const selectedCategory = categories.find((cat, index) => {
        const categoryId = String(
            cat.id || cat.category_id || cat._id || index
        );
        return categoryId === selectedCategoryId;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4">

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-lg sm:text-xl font-semibold">
                        All Categories
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500">
                        {categories.length} found
                    </p>
                </div>

                {/* 🔥 1:3 Layout */}
                <div className="grid grid-cols-4 md:grid-cols-4 gap-2">

                    {/* Sidebar (1 span) */}
                    <aside className="col-span-1 bg-purple-100 rounded-lg shadow-sm p-2 h-screen overflow-y-auto md:sticky md:top-4">
                        {loadingCategories && (
                            <p className="text-sm text-gray-500 px-2 py-3">
                                Loading categories...
                            </p>
                        )}

                        {!loadingCategories && categories.length === 0 && (
                            <p className="text-sm text-gray-500 px-2 py-3">
                                No categories found.
                            </p>
                        )}

                        <div className="space-y-1 flex flex-col fixed-height-scrollbar">
                            {categories.map((cat, index) => {
                                const categoryId = String(
                                    cat.id || cat.category_id || cat._id || index
                                );
                                const imageSrc = cat.image || cat.icon || "";
                                const isActive =
                                    selectedCategoryId === categoryId;

                                return (
                                    <button
                                        key={categoryId}
                                        onClick={() =>
                                            setSelectedCategoryId(categoryId)
                                        }
                                        className={`w-full flex flex-col items-center gap-3 px-2 py-2 rounded-md transition
                      ${isActive
                                                ? "bg-blue-50 text-blue-600 font-medium"
                                                : "hover:bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden">
                                            {imageSrc ? (
                                                <img
                                                    src={imageSrc}
                                                    alt={cat.name || "Category"}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200" />
                                            )}
                                        </div>

                                        <p className="text-sm truncate">
                                            {cat.name || "Category"}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </aside>

                    {/* Products (3 span) */}
                    <div className="col-span-3 bg-white h-screen overflow-y-auto rounded-lg p-4 min-w-0">

                        <div className="flex justify-between items-center mb-4">
                            <p className="text-base sm:text-lg font-semibold text-gray-900">
                                {selectedCategory?.name || "Products"}
                            </p>
                            <p className="text-xs text-gray-500">
                                {products.length} items
                            </p>
                        </div>

                        {loadingProducts && (
                            <p className="text-sm text-gray-500">
                                Loading products...
                            </p>
                        )}

                        {!loadingProducts && products.length === 0 && (
                            <p className="text-sm text-gray-500">
                                No products found.
                            </p>
                        )}

                        {/* Product Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {products.map((product, index) => {
                                const productId = String(
                                    product.id ||
                                    product.product_id ||
                                    product._id ||
                                    index
                                );

                                const imageSrc =
                                    product.images?.[0] || product.image || "";

                                const numericPrice =
                                    parseNonNegativeNumber(product.price);

                                const oldPrice =
                                    numericPrice > 0
                                        ? Math.round(numericPrice * 1.2)
                                        : 0;

                                const discountPct =
                                    oldPrice > 0
                                        ? Math.round(
                                            ((oldPrice - numericPrice) /
                                                oldPrice) *
                                            100
                                        )
                                        : 0;

                                return (
                                    <Link
                                        key={productId}
                                        to={`/products/${productId}`}
                                        className="group"
                                    >
                                        <article className="bg-white rounded-md p-2 hover:shadow-md transition">

                                            {/* Image */}
                                            <div className="relative bg-gray-100 rounded-md overflow-hidden">
                                                {discountPct > 0 && (
                                                    <span className="absolute top-2 left-2 bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                                                        {discountPct}% off
                                                    </span>
                                                )}

                                                {imageSrc ? (
                                                    <img
                                                        src={imageSrc}
                                                        alt={product.title}
                                                        className="w-full h-32 sm:h-36 object-cover group-hover:scale-105 transition"
                                                    />
                                                ) : (
                                                    <div className="w-full h-32 sm:h-36 bg-gray-200" />
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="mt-2 space-y-1">
                                                <p className="text-xs sm:text-sm text-gray-800 line-clamp-2">
                                                    {product.title || "Untitled"}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    {product.brand || "Generic"}
                                                </p>

                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {formatPrice(product.price)}
                                                    </p>

                                                    {oldPrice > 0 && (
                                                        <p className="text-xs text-gray-400 line-through">
                                                            NGN {oldPrice.toLocaleString()}
                                                        </p>
                                                    )}
                                                </div>

                                                <p className="text-xs text-green-600 font-medium">
                                                    Hot Deal
                                                </p>
                                            </div>
                                        </article>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default AllCategories;