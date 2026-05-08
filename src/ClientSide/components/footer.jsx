import { NavLink } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { useCallback, useEffect, useState } from "react";
import { extractList, getCart } from "../../api/services";

const navItems = [
    { name: "Home", icon: AiOutlineHome, link: "/" },
    { name: "Categories", icon: BiCategory, link: "/allcategories" },
    { name: "Cart", icon: HiOutlineShoppingCart, link: "/cart" },
    { name: "Profile", icon: CgProfile, link: "/profile" },
];


function Footer() {
    const [cartLength, setCartLength] = useState(0);

    const fetchCartCount = useCallback(async () => {
        const userId = localStorage.getItem("user_id") || localStorage.getItem("client_user_id") || "";

        if (!userId) {
            setCartLength(0);
            return;
        }

        try {
            const response = await getCart(userId);
            const cartData = extractList(response.data);
            const products = cartData?.[0]?.products || [];
            setCartLength(Array.isArray(products) ? products.length : 0);
            console.log("Cart data:", products);
        } catch {
            setCartLength(0);
        }
    }, []);

    useEffect(() => {
        fetchCartCount();

        const handleWindowFocus = () => {
            fetchCartCount();
        };

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                fetchCartCount();
            }
        };

        const handleCartChanged = () => {
            fetchCartCount();
        };

        window.addEventListener("focus", handleWindowFocus);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("cart-updated", handleCartChanged);

        return () => {
            window.removeEventListener("focus", handleWindowFocus);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("cart-updated", handleCartChanged);
        };
    }, [fetchCartCount]);


    return (
        <footer className="fixed bottom-0 left-0 right-0 border-t border-gray-300 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/85 z-20">
            <nav className="mx-auto grid h-[calc(4rem+env(safe-area-inset-bottom))] max-w-2xl grid-cols-4 items-center px-1 pb-[env(safe-area-inset-bottom)]">
                {navItems.map(({ name, icon: Icon, link }) => (
                    <NavLink
                        key={name}
                        to={link}
                        className={({ isActive }) =>
                            `flex min-w-0 flex-col items-center justify-center gap-0.5 px-1 py-1 text-[11px] leading-tight sm:text-xs ${isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-500"
                            }`
                        }
                    >
                        <span className="relative inline-flex">
                            <Icon size={20} className="sm:h-6 sm:w-6" />
                            {name === "Cart" && cartLength > 0 ? (
                                <span className="absolute -right-2 -top-2 min-w-4.5 rounded-full bg-red-500 px-1.5 py-0.5 text-center text-[10px] font-semibold leading-none text-white">
                                    {cartLength > 99 ? "99+" : cartLength}
                                </span>
                            ) : null}
                        </span>
                        <span className="truncate">{name}</span>
                    </NavLink>
                ))}
            </nav>
        </footer>
    );
}

export default Footer;