import { Link } from "react-router-dom";
import flipkartLogo from "../../assets/flipkartLogo.webp";
import airplaneLogo from "../../assets/airplaneLogo.webp";
import { FaLocationDot } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";

function ClientNavbar() {

  return (
    <header className="bg-white sticky top-0 z-10 bg-linear-to-b from-blue-300 to-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-5  justify-between">

        <div className="flex items-center justify-center gap-10 ">
          <Link to="/" className="text-xl font-bold text-blue-700 ">
            <img src={flipkartLogo} alt="Flipkart Logo" className="h-12 rounded-xl w-auto bg-amber-200  px-10" />
          </Link>
          <Link to="/" className="flex items-center gap-2 h-12 rounded-xl w-auto bg-white px-10 text-xl font-bold text-blue-700 ">
            <img src={airplaneLogo} alt="Airplane Logo" className="h-8 w-auto" />
            <span>Travel</span>
          </Link>


        </div>


        <nav className="flex items-center gap-4 text-sm font-medium">
          <li className="list-none flex justify-center gap-2 items-center"><FaLocationDot
          /> <span>Location not set</span> <Link to="/" className="text-blue-600 font-bold"> Select delivery location <span>{`>`}</span></Link> </li>

        </nav>

        <section>
          <div className="rounded-2xl border-blue-500 border-1 bg-white outline-0 px-5 py-2 flex items-center gap-2">
            <CiSearch className="text-blue-600 font-bold text-2xl" />
            <input type="text" placeholder="Search for Products" className="flex-1 outline-none" />
          </div>
        </section>
      </div>
    </header>
  )
};

export default ClientNavbar;
