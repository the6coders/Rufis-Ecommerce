import { NavLink } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";

const navItems = [
    { name: "Home", icon: AiOutlineHome, link: "/" },
    { name: "Categories", icon: BiCategory, link: "/allcategories" },
    { name: "Cart", icon: HiOutlineShoppingCart, link: "/cart" },
    { name: "Profile", icon: CgProfile, link: "/profile" },
];

function Footer() {
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
                        <Icon size={20} className="sm:h-6 sm:w-6" />
                        <span className="truncate">{name}</span>
                    </NavLink>
                ))}
            </nav>
        </footer>
    );
}

export default Footer;