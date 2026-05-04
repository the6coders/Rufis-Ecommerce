import { useEffect, useRef, useState } from "react";
import {
  createProduct,
  DEFAULT_MERCHANT_ID,
  extractList,
  getCategories,
} from "../../api/services";

const SelectionInput = ({ options, ...props }) => (
  <select {...props}>
    <option value="">Select a category</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const TARGET_IMAGE_BYTES = 55 * 1024;
const FAST_PASS_BYTES = 35 * 1024;
const MAX_IMAGE_DIMENSION = 1280;
const MIN_QUALITY = 0.35;
const MAX_COMPRESSION_ATTEMPTS = 6;

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Failed to read image data."));
    };
    reader.onerror = () => reject(new Error("Failed to read image data."));
    reader.readAsDataURL(blob);
  });

const loadImageElement = (file) =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to load selected image."));
    };
    img.src = objectUrl;
  });

const canvasToBlob = (canvas, quality) =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Unable to process selected image."));
          return;
        }
        resolve(blob);
      },
      "image/webp",
      quality
    );
  });

const compressImageForPayload = async (file, onProgress) => {
  if (file.size <= FAST_PASS_BYTES) {
    onProgress?.(100);
    const dataUrl = await blobToDataUrl(file);
    return { dataUrl, bytes: file.size };
  }

  const image = await loadImageElement(file);
  const largestSide = Math.max(image.naturalWidth, image.naturalHeight);
  const downscaleRatio =
    largestSide > MAX_IMAGE_DIMENSION ? MAX_IMAGE_DIMENSION / largestSide : 1;

  let width = image.naturalWidth * downscaleRatio;
  let height = image.naturalHeight * downscaleRatio;
  let quality = 0.82;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to process selected image.");

  onProgress?.(10);

  for (let attempt = 0; attempt < MAX_COMPRESSION_ATTEMPTS; attempt += 1) {
    canvas.width = Math.max(1, Math.round(width));
    canvas.height = Math.max(1, Math.round(height));
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const blob = await canvasToBlob(canvas, quality);
    const progress = Math.min(
      95,
      Math.round(20 + ((attempt + 1) / MAX_COMPRESSION_ATTEMPTS) * 70)
    );
    onProgress?.(progress);

    if (blob.size <= TARGET_IMAGE_BYTES) {
      const dataUrl = await blobToDataUrl(blob);
      onProgress?.(100);
      return { dataUrl, bytes: blob.size };
    }

    if (quality > MIN_QUALITY) {
      quality = Math.max(MIN_QUALITY, quality - 0.15);
    } else {
      width *= 0.75;
      height *= 0.75;
    }
  }

  throw new Error("Image is too large even after compression.");
};

function CreateProduct() {
  const [merchantId, setMerchantId] = useState(localStorage.getItem("merchant_id") || DEFAULT_MERCHANT_ID);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [imageSource, setImageSource] = useState("url");
  const [imageFileName, setImageFileName] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);
  const uploadPreviewUrlRef = useRef("");

  useEffect(() => {
    const currentMerchantId = localStorage.getItem("merchant_id") || DEFAULT_MERCHANT_ID;
    localStorage.setItem("merchant_id", currentMerchantId);
    setMerchantId(currentMerchantId);
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      if (!merchantId) {
        setCategoryOptions([]);
        return;
      }
      setLoadingCategories(true);
      try {
        const response = await getCategories(merchantId);
        const categories = extractList(response.data);
        const options = categories
          .map((cat) => {
            const id = cat.id || cat.category_id || cat._id;
            if (!id) return null;
            return { value: String(id), label: cat.name || `Category ${id}` };
          })
          .filter(Boolean);
        setCategoryOptions(options);
      } catch {
        setCategoryOptions([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, [merchantId]);

  const clearUploadPreviewUrl = () => {
    if (uploadPreviewUrlRef.current) {
      URL.revokeObjectURL(uploadPreviewUrlRef.current);
      uploadPreviewUrlRef.current = "";
    }
  };

  useEffect(() => {
    return () => {
      clearUploadPreviewUrl();
    };
  }, []);

  const handleImageFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setImage("");
      setImageFileName("");
      setImagePreview("");
      setImageProgress(0);
      return;
    }

    clearUploadPreviewUrl();
    const localPreviewUrl = URL.createObjectURL(file);
    uploadPreviewUrlRef.current = localPreviewUrl;
    setImagePreview(localPreviewUrl);

    setProcessingImage(true);
    setImageProgress(5);
    setStatus("");

    try {
      const { dataUrl, bytes } = await compressImageForPayload(file, setImageProgress);
      setImage(dataUrl);
      setImageFileName(`${file.name} (${Math.round(bytes / 1024)} KB)`);
      setImagePreview(dataUrl);
      clearUploadPreviewUrl();
    } catch {
      setImage("");
      setImageFileName("");
      setStatus(
        "Selected image is too large for this API payload limit. Use a smaller image or switch to URL mode."
      );
    } finally {
      setImageProgress(0);
      setProcessingImage(false);
      event.target.value = "";
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!categoryId) {
      setStatus("Please select a category.");
      return;
    }

    if (!image) {
      setStatus(
        imageSource === "url"
          ? "Please enter an image URL."
          : "Please upload a product image from your device."
      );
      return;
    }

    if (processingImage) {
      setStatus("Please wait, image processing is still in progress.");
      return;
    }

    setSubmitting(true);
    setStatus("");

    const productData = {
      title,
      descp: description,
      price: Number(price),
      brand: brand || "Generic",
      quantity: Number(quantity),
      images: image ? [image] : [],
      currency: "NGN",
      min_qty: 1,
      max_qty: Number(quantity) > 0 ? Number(quantity) : 1,
      discount: 0,
      discount_expiration: "",
      has_refund_policy: false,
      has_discount: false,
      has_shipment: true,
      has_variation: false,
      shipping_locations: ["Nigeria"],
      attrib: [],
      category_id: categoryId,
      merchant_id: merchantId,
    };

    console.log("Submitting product:", productData);

    try {
      const response = await createProduct(productData);
      console.log("Create product response:", response);
      localStorage.setItem("merchant_id", merchantId);
      setStatus("Product created successfully.");
      setTitle("");
      setImage("");
      setImageSource("url");
      setImageFileName("");
      setImagePreview("");
      setImageProgress(0);
      clearUploadPreviewUrl();
      setPrice("");
      setQuantity("");
      setDescription("");
      setBrand("");
      setCategoryId("");
    } catch (err) {
      const responseText =
        typeof err?.response?.data === "string" ? err.response.data : "";
      const payloadTooLarge =
        err?.response?.status === 413 || responseText.includes("PayloadTooLargeError");

      if (payloadTooLarge) {
        setStatus("Product creation failed: image payload is too large. Try a smaller image or use an image URL.");
        return;
      }

      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message ||
        "Unknown error";
      console.error("Create product error:", err?.response ?? err);
      setStatus(`Product creation failed: ${apiMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold">Create Product</h1>

      <form onSubmit={onSubmit} className="bg-white rounded shadow p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
        <div>
          <label className="block text-sm mb-1">Merchant ID</label>
          <input
            className="border rounded px-3 py-2 w-full bg-gray-100 text-gray-600 cursor-not-allowed"
            value={merchantId}
            readOnly
            aria-readonly="true"
            title="Merchant ID is locked"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Category</label>
          <SelectionInput
            className="border rounded px-3 py-2 w-full"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            options={categoryOptions}
            required
            disabled={loadingCategories || categoryOptions.length === 0}
          />
          {loadingCategories ? <p className="text-xs text-gray-500 mt-1">Loading categories...</p> : null}
          {!loadingCategories && categoryOptions.length === 0 ? (
            <p className="text-xs text-gray-500 mt-1">No categories available. Create one first.</p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            className="border rounded px-3 py-2 w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Brand</label>
          <input
            className="border rounded px-3 py-2 w-full"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Product Image Source</label>
          <div className="flex items-center gap-4 mb-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="image-source"
                value="url"
                checked={imageSource === "url"}
                onChange={() => {
                  setImageSource("url");
                  setImage("");
                  setImageFileName("");
                  setImagePreview("");
                  setImageProgress(0);
                  clearUploadPreviewUrl();
                }}
              />
              URL
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="image-source"
                value="upload"
                checked={imageSource === "upload"}
                onChange={() => {
                  setImageSource("upload");
                  setImage("");
                  setImageFileName("");
                  setImagePreview("");
                  setImageProgress(0);
                  clearUploadPreviewUrl();
                }}
              />
              Upload from device
            </label>
          </div>

          {imageSource === "url" ? (
            <input
              className="border rounded px-3 py-2 w-full"
              value={image}
              onChange={(e) => {
                setImage(e.target.value);
                setImagePreview(e.target.value);
              }}
              placeholder="https://example.com/image.jpg"
            />
          ) : (
            <>
              <input
                className="border rounded px-3 py-2 w-full"
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
              />
              {processingImage ? (
                <p className="text-xs text-gray-500 mt-1">Processing image... {imageProgress}%</p>
              ) : null}
              {imageFileName ? <p className="text-xs text-gray-500 mt-1">Selected: {imageFileName}</p> : null}
            </>
          )}

          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Product preview"
              className="mt-3 h-24 w-24 object-cover rounded border"
            />
          ) : null}
        </div>

        <div>
          <label className="block text-sm mb-1">Price</label>
          <input
            className="border rounded px-3 py-2 w-full"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Quantity</label>
          <input
            className="border rounded px-3 py-2 w-full"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            type="number"
            min="0"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Description</label>
          <textarea
            className="border rounded px-3 py-2 w-full"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            disabled={submitting}
            className="bg-gray-900 text-white px-4 py-2 rounded disabled:opacity-60 w-full sm:w-auto"
            type="submit"
          >
            {submitting ? "Creating..." : "Create Product"}
          </button>
          {status ? <p className="text-sm text-gray-700">{status}</p> : null}
        </div>
      </form>
    </div>
  );
}

export default CreateProduct;