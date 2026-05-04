import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import Sidebar from "./Sidebar";

function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-base font-semibold text-gray-900">Admin Panel</h1>
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="w-9 h-9 rounded-md border border-gray-200 flex items-center justify-center"
          aria-label="Open admin menu"
        >
          <FiMenu size={18} />
        </button>
      </header>

      <div className="flex min-h-screen">
        <aside className="hidden lg:block shrink-0 border-r border-gray-800">
          <Sidebar />
        </aside>

        {isSidebarOpen ? (
          <div className="lg:hidden fixed inset-0 z-50">
            <button
              type="button"
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close admin menu overlay"
            />

            <div className="relative w-72 h-full">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center"
                aria-label="Close admin menu"
              >
                <FiX size={16} />
              </button>
              <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
            </div>
          </div>
        ) : null}

        <main className="flex-1 p-4 sm:p-5 lg:p-6 overflow-x-hidden">
        {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;