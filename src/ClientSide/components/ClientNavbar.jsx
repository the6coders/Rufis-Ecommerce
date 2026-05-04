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
  const toggleAnchorYRef = useRef(0);
  const showTopBarRef = useRef(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    showTopBarRef.current = showTopBar;
  }, [showTopBar]);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    toggleAnchorYRef.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollYRef.current;
      const scrollingUp = currentScrollY < lastScrollYRef.current;
      const isVisible = showTopBarRef.current;

      if (currentScrollY <= 24) {
        if (!isVisible) {
          setShowTopBar(true);
          showTopBarRef.current = true;
        }
        toggleAnchorYRef.current = currentScrollY;
      } else if (isVisible && scrollingDown && currentScrollY - toggleAnchorYRef.current > 72) {
        setShowTopBar(false);
        showTopBarRef.current = false;
        toggleAnchorYRef.current = currentScrollY;
      } else if (!isVisible && scrollingUp && toggleAnchorYRef.current - currentScrollY > 36) {
        setShowTopBar(true);
        showTopBarRef.current = true;
        toggleAnchorYRef.current = currentScrollY;
      } else if (!isVisible && scrollingDown) {
        toggleAnchorYRef.current = currentScrollY;
      }

      lastScrollYRef.current = currentScrollY;
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
    <header className="sticky top-0 z-50 bg-linear-to-b from-blue-300 via-blue-100 to-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 pt-3">
        <div className={`overflow-hidden transition-all duration-300 ease-out ${showTopBar ? "max-h-48 opacity-100 pb-3" : "max-h-0 opacity-0 pb-0 pointer-events-none"}`}>
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

        <section className="pb-2">
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
