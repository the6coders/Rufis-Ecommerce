import { use, useContext } from "react";
import { Link } from "react-router-dom";
import { DataContent } from "../../contexts/DataContext";

function HomePage() {
  const { user } = useContext(DataContent);
  return (
    <section className="bg-white rounded-xl shadow p-6 md:p-10">
      <p className="text-sm uppercase tracking-wide text-blue-600 font-semibold">Flipkart Clone</p>
      <h1 className="text-3xl md:text-4xl font-bold mt-2">Client Side Ready</h1>
      <p className="text-gray-600 mt-3 max-w-2xl">
        You now have a dedicated client-side folder. Next we can build product listing, product details,
        cart, checkout, and user flows exactly like a modern e-commerce storefront.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/products" className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800">
          Browse Products as {user.toUpperCase()}
        </Link>
        <Link to="/cart" className="bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200">
          View Cart
        </Link>
      </div>
    </section>
  );
}

export default HomePage;
