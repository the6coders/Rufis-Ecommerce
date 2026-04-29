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
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
            <nav className="flex justify-around items-center h-16">
                {navItems.map(({ name, icon: Icon, link }) => (
                    <NavLink
                        key={name}
                        to={link}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-0.5 text-xs px-3 py-1 ${isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-500"
                            }`
                        }
                    >
                        <Icon size={24} />
                        <span>{name}</span>
                    </NavLink>
                ))}
            </nav>
        </footer>
    );
}

export default Footer;