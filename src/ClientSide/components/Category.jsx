import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createMerchant, DEFAULT_MERCHANT_ID, extractList, extractObject, getCategories } from "../../api/services";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [merchantId, setMerchantId] = useState(localStorage.getItem("merchant_id") || DEFAULT_MERCHANT_ID);

    const buildDefaultMerchantPayload = () => {
        const seed = Date.now();
        return {
            first_name: "Admin",
            last_name: "Store",
            email: `admin${seed}@flikpart.app`,
            phone: `090${String(seed).slice(-7)}`,
            store_name: "Flikpart Demo Store",
            description: "Admin merchant account",
            icon: "",
            banner: "",
            phones: [98767887, 98657654],
            password: "123456",
        };
    };

    const resolveMerchantId = async () => {
        const cachedMerchantId = localStorage.getItem("merchant_id") || "";
        if (cachedMerchantId) {
            setMerchantId(cachedMerchantId);
            return cachedMerchantId;
        }

        const merchantRes = await createMerchant(buildDefaultMerchantPayload());
        const merchantData = extractObject(merchantRes.data);
        const newMerchantId = String(merchantData.id || merchantData.merchant_id || merchantData._id || "");

        if (!newMerchantId) return "";

        localStorage.setItem("merchant_id", newMerchantId);
        setMerchantId(newMerchantId);
        return newMerchantId;
    };

    useEffect(() => {
        const syncMerchantId = () => {
            const current = localStorage.getItem("merchant_id") || "";
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
                setCategories(extractList(response.data));
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