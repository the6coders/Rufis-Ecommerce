import { useState } from "react";
import { createCategory, DEFAULT_MERCHANT_ID } from "../../api/services";
// import { createCategory, extractList, getCategories } from "../../api/services";


function CreateCategory() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [merchantId, setMerchantId] = useState(localStorage.getItem("merchant_id") || DEFAULT_MERCHANT_ID);

  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // export const createCategory = async (categoryData) => await api.post("/categories", categoryData);

  const createSingleCategory = async (e) => {
    e.preventDefault();

    if (!merchantId) {
      setStatus("Merchant ID is required.");
      return;
    }

    if (!name.trim() || !image.trim()) {
      setStatus("Category name and image URL cannot be empty.");
      return;
    }

    const categoryData = {
      name: name.trim(),
      image: image.trim(),
      merchant_id: merchantId,
    };

    setSubmitting(true);
    setStatus("");

    try {
      const resp = await createCategory(categoryData);

      if (resp.status === 200 || resp.status === 201) {
        setStatus("Category created successfully!");
        setName("");
        setImage("");
      } else {
        setStatus("Failed to create category. Please try again.");
      }
    } catch {
      setStatus("Failed to create category. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create Category</h1>

      <form onSubmit={createSingleCategory} className="bg-white rounded shadow p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Merchant ID</label>
          <input
            className="border rounded px-3 py-2 w-full"
            name="merchant_id"
            value={merchantId}
            onChange={(e) => setMerchantId(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Category Name</label>
          <input
            className="border rounded px-3 py-2 w-full"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. electronics"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Image URL</label>
          <input
            className="border rounded px-3 py-2 w-full"
            name="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/category.png"
            required
          />
        </div>

        <div className="md:col-span-2 flex flex-wrap items-center gap-3">
          <button
            disabled={submitting}
            className="bg-gray-900 text-white px-4 py-2 rounded disabled:opacity-60"
            type="submit"
          >
            {submitting ? "Processing..." : "Create Category"}
          </button>

          {status ? <p className="text-sm text-gray-700">{status}</p> : null}
        </div>
      </form>
    </div>
  );
}


export default CreateCategory;
