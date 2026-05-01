import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DEFAULT_MERCHANT_ID, extractList, getCategories } from "../../api/services";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [merchantId, setMerchantId] = useState(localStorage.getItem("merchant_id") || DEFAULT_MERCHANT_ID);



    const resolveMerchantId = async () => {
        const cachedMerchantId = localStorage.getItem("merchant_id") || DEFAULT_MERCHANT_ID;
        localStorage.setItem("merchant_id", cachedMerchantId);
        setMerchantId(cachedMerchantId);
        return cachedMerchantId;
    };

    useEffect(() => {
        const syncMerchantId = () => {
            const current = localStorage.getItem("merchant_id") || DEFAULT_MERCHANT_ID;
            setMerchantId((prev) => (prev === current ? prev : current));
        };

        syncMerchantId();
        window.addEventListener("storage", syncMerchantId);
        window.addEventListener("focus", syncMerchantId);

        return () => {
            window.removeEventListener("storage", syncMerchantId);
            window.removeEventListener("focus", syncMerchantId);
        };
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            const currentMerchantId = merchantId || await resolveMerchantId();
            if (!currentMerchantId) {
                setCategories([]);
                return;
            }

            try {
                const response = await getCategories(currentMerchantId);
                let categoryList = extractList(response.data);

                if (categoryList.length === 0 && currentMerchantId !== DEFAULT_MERCHANT_ID) {
                    const fallbackResponse = await getCategories(DEFAULT_MERCHANT_ID);
                    const fallbackList = extractList(fallbackResponse.data);

                    if (fallbackList.length > 0) {
                        localStorage.setItem("merchant_id", DEFAULT_MERCHANT_ID);
                        setMerchantId(DEFAULT_MERCHANT_ID);
                        categoryList = fallbackList;
                    }
                }

                setCategories(categoryList);
            } catch {
                setCategories([]);
            }
        };

        if (!merchantId) {
            setCategories([]);
        }
        fetchCategories();
    }, [merchantId]);

    if (categories.length === 0) {
        return <p className="text-sm text-gray-500 px-3 py-2">No categories found yet.</p>;
    }

    return (
        <div className="flex gap-4 overflow-x-auto px-3 py-2 scrollbar-hide">
            {categories.map((cat, index) => {
                const imageSrc = cat.image || cat.icon;
                const key = String(cat.id || cat.category_id || cat._id || index);

                return (
                    <Link
                        key={key}
                        to={`/categories/${key}`}
                        className="flex flex-col mt-3 items-center min-w-15"
                    >
                        {imageSrc
                            ? <img src={imageSrc} alt={cat.name || "Category"} className="w-5 h-5 object-cover rounded-full" />
                            : <div className="w-5 h-5 rounded-full bg-gray-200" />
                        }
                        <p className="text-xs mt-1 text-center">{String(cat.name || "Category").slice(0, 9)}</p>
                    </Link>
                );
            })}
        </div>
    );
}

export default Categories;