import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DEFAULT_MERCHANT_ID, deleteProduct, extractList, getProducts, updateProduct } from "../../api/services";

function Products() {
    const [merchantId, setMerchantId] = useState(localStorage.getItem("merchant_id") || DEFAULT_MERCHANT_ID);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [editingId, setEditingId] = useState("");
    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        price: "",
        quantity: "",
        brand: "",
    });

    const [searchParams] = useSearchParams();
    const activeCategoryId = searchParams.get("category_id") || "";
    // length of total products in this category
    const [totalProducts, setTotalProducts] = useState(0);

    useEffect(() => {
        const currentMerchantId = localStorage.getItem("merchant_id") || DEFAULT_MERCHANT_ID;
        localStorage.setItem("merchant_id", currentMerchantId);
        setMerchantId(currentMerchantId);
    }, []);

    const loadProducts = async (catId) => {
        if (!merchantId) {
            setProducts([]);
            setTotalProducts(0);
            return;
        }
        setLoading(true);
        setError("");
        try {
            const response = await getProducts(merchantId, catId || "");
            const productList = extractList(response.data);
            setProducts(productList);
            setTotalProducts(productList.length);
            localStorage.setItem("merchant_id", String(merchantId));
        } catch {
            setError("Could not load products. Confirm merchant ID and retry.");
            setProducts([]);
            setTotalProducts(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts(activeCategoryId);
    }, [activeCategoryId]);

    const filteredProducts = useMemo(() => {
        if (!query.trim()) return products;
        const term = query.toLowerCase();
        return products.filter((p) => {
            const title = String(p.title || "").toLowerCase();
            const brand = String(p.brand || "").toLowerCase();
            return title.includes(term) || brand.includes(term);
        });
    }, [products, query]);

    const startEdit = (product) => {
        const id = product.id || product.product_id || product._id;
        setEditingId(String(id));
        setEditForm({
            title: product.title || "",
            description: product.descp || "",
            price: String(product.price ?? ""),
            quantity: String(product.quantity ?? ""),
            brand: product.brand || "",
        });
    };

    const cancelEdit = () => {
        setEditingId("");
        setEditForm({ title: "", description: "", price: "", quantity: "", brand: "" });
    };

    const submitEdit = async (product) => {
        const productId = product.id || product.product_id || product._id;
        if (!productId) return;
        try {
            await updateProduct(productId, {
                ...product,
                title: editForm.title,
                descp: editForm.description,
                price: Number(editForm.price || 0),
                quantity: Number(editForm.quantity || 0),
                brand: editForm.brand,
            });
            await loadProducts(activeCategoryId);
            cancelEdit();
        } catch {
            setError("Product update failed. The API might not support update in this environment.");
        }
    };

    const handleDelete = async (product) => {
        const productId = product.id || product.product_id || product._id;
        if (!productId) return;
        if (!window.confirm("Delete this product?")) return;
        try {
            await deleteProduct(productId);
            setProducts((prev) => {
                const updated = prev.filter((item) =>
                    String(item.id || item.product_id || item._id) !== String(productId)
                );
                setTotalProducts(updated.length);
                return updated;
            });
        } catch {
            setError("Product delete failed. The API might not support delete in this environment.");
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Products</h1>

            <div className="bg-white p-4 rounded shadow mb-5 flex flex-wrap items-end gap-3">
                <div>
                    <label className="block text-sm mb-1">Merchant ID</label>
                    <input
                        className="border rounded px-3 py-2 min-w-64"
                        value={merchantId}
                        onChange={(e) => setMerchantId(e.target.value)}
                        placeholder="Enter merchant id"
                    />
                </div>

                <button onClick={() => loadProducts(activeCategoryId)} className="bg-gray-900 text-white px-4 py-2 rounded">
                    Load Products
                </button>

                <div className="ml-auto">
                    <input
                        className="border rounded px-3 py-2"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search title or brand"
                    />
                </div>
            </div>

            {activeCategoryId ? (
                <>
                    <p className="mb-3 text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded inline-block">
                        Filtering by category ID: <strong>{activeCategoryId}</strong>
                    </p>
                </>
            ) : null}

            <p className="mb-4 text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded inline-block">
                Total products {activeCategoryId ? "in this category" : "loaded"}: <strong>{totalProducts}</strong>
            </p>

            {error ? <p className="mb-4 rounded bg-red-100 text-red-700 px-3 py-2">{error}</p> : null}
            {loading ? <p>Loading products...</p> : null}

            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-left text-xs uppercase text-gray-500">
                        <tr>
                            <th className="px-4 py-3">Image</th>
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Brand</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Qty</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredProducts.length === 0 && !loading ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                                    No products found.
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map((product, index) => {
                                const id = String(product.id || product.product_id || product._id || index);
                                const isEditing = editingId === id;
                                const imageSrc = product.images?.[0] || product.image || null;

                                return isEditing ? (
                                    <tr key={id} className="bg-blue-50">
                                        <td className="px-4 py-3" colSpan={6}>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                <input
                                                    className="border rounded px-3 py-2"
                                                    value={editForm.title}
                                                    onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                                                    placeholder="Title"
                                                />
                                                <input
                                                    className="border rounded px-3 py-2"
                                                    value={editForm.brand}
                                                    onChange={(e) => setEditForm((prev) => ({ ...prev, brand: e.target.value }))}
                                                    placeholder="Brand"
                                                />
                                                <input
                                                    className="border rounded px-3 py-2"
                                                    value={editForm.price}
                                                    onChange={(e) => setEditForm((prev) => ({ ...prev, price: e.target.value }))}
                                                    placeholder="Price"
                                                    type="number"
                                                />
                                                <input
                                                    className="border rounded px-3 py-2"
                                                    value={editForm.quantity}
                                                    onChange={(e) => setEditForm((prev) => ({ ...prev, quantity: e.target.value }))}
                                                    placeholder="Quantity"
                                                    type="number"
                                                />
                                                <textarea
                                                    className="border rounded px-3 py-2 col-span-2"
                                                    value={editForm.description}
                                                    onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                                                    placeholder="Description"
                                                    rows={2}
                                                />
                                            </div>
                                            <div className="flex gap-2 mt-2">
                                                <button onClick={() => submitEdit(product)} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Save</button>
                                                <button onClick={cancelEdit} className="bg-gray-200 px-3 py-1 rounded text-sm">Cancel</button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr key={id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            {imageSrc ? (
                                                <img src={imageSrc} alt={product.title || "Product"} className="w-12 h-12 object-cover rounded" />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-200 rounded" />
                                            )}
                                        </td>
                                        <td className="px-4 py-3 font-medium max-w-xs">
                                            <p className="line-clamp-2">{product.title || "Untitled"}</p>
                                            <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{product.descp || ""}</p>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{product.brand || "-"}</td>
                                        <td className="px-4 py-3 text-gray-600">NGN {Number(product.price || 0).toLocaleString()}</td>
                                        <td className="px-4 py-3 text-gray-600">{product.quantity ?? 0}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button onClick={() => startEdit(product)} className="bg-blue-600 text-white px-3 py-1 rounded text-xs">Edit</button>
                                                <button onClick={() => handleDelete(product)} className="bg-red-600 text-white px-3 py-1 rounded text-xs">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Products;
