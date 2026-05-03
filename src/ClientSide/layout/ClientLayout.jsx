import Categories from "../components/Category";
import ClientNavbar from "../components/ClientNavbar";
import Footer from "../components/footer";

function ClientLayout({ children, showNavbar = true, showCategories = true }) {
  return (
    <div className="min-h-screen bg-gray-50 pb-[calc(5rem+env(safe-area-inset-bottom))]">
      {showNavbar ? <ClientNavbar /> : null}
      {showCategories ? <Categories /> : null}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default ClientLayout;
