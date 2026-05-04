import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import flipkartLogo from "../../assets/flipkartLogo.webp";
import airplaneLogo from "../../assets/airplaneLogo.webp";
import { FaLocationDot } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { DataContent } from "../../contexts/DataContext";

function ClientNavbar() {
  const { searchQuery, setSearchQuery } = useContext(DataContent);
  const [showTopBar, setShowTopBar] = useState(true);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const updateNavbar = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollYRef.current + 8;
      const isScrollingUp = currentScrollY < lastScrollYRef.current - 8;

      if (currentScrollY <= 24) {
        setShowTopBar(true);
      } else if (isScrollingDown) {
        setShowTopBar(false);
      } else if (isScrollingUp) {
        setShowTopBar(true);
      }

      lastScrollYRef.current = currentScrollY;
      tickingRef.current = false;
    };

    const handleScroll = () => {
      if (tickingRef.current) {
        return;
      }

      tickingRef.current = true;
      window.requestAnimationFrame(updateNavbar);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchFocus = () => {
    if (location.pathname === "/" || location.pathname === "/products" || location.pathname.startsWith("/categories/")) {
      return;
    }

    navigate("/products");
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-linear-to-b from-blue-300 via-blue-100 to-transparent px-4 pt-3 transition-[padding] duration-300">
        <div className={`max-w-7xl mx-auto overflow-hidden transition-all duration-300 ${showTopBar ? "max-h-48 opacity-100 translate-y-0 pb-3" : "max-h-0 opacity-0 -translate-y-full pb-0"}`}>
          <div className="flex items-center justify-center gap-3 sm:gap-10">
            <Link to="/" className="text-xl font-bold text-blue-700">
              <img src={flipkartLogo} alt="Flipkart Logo" className="h-12 rounded-xl w-auto bg-amber-200 px-6 sm:px-10" />
            </Link>
            <Link to="/" className="flex items-center gap-2 h-12 rounded-xl w-auto bg-white px-5 sm:px-10 text-xl font-bold text-blue-700">
              <img src={airplaneLogo} alt="Airplane Logo" className="h-8 w-auto" />
              <span>Travel</span>
            </Link>
          </div>

          <nav className="mt-4 flex items-center gap-4 text-sm font-medium">
            <li className="list-none flex flex-wrap justify-center gap-2 items-center text-center w-full">
              <FaLocationDot />
              <span>Location not set</span>
              <Link to="/" className="text-blue-600 font-bold">Select delivery location <span>{`>`}</span></Link>
            </li>
          </nav>
        </div>

        <section className="max-w-7xl mx-auto sticky top-1 z-10 pb-2">
          <div className="rounded-2xl border border-blue-500 bg-white px-5 py-2 flex items-center gap-2 shadow-sm">
            <CiSearch className="text-blue-600 font-bold text-2xl" />
            <input
              type="text"
              placeholder="Search for products"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              className="flex-1 outline-none bg-transparent"
            />
          </div>
        </section>
      </div>
    </header>
  )
};

export default ClientNavbar;
