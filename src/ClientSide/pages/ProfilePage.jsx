import { Link, useNavigate } from "react-router-dom";
import { FiChevronRight, FiGift, FiHeart, FiMapPin, FiPackage, FiSettings, FiShield, FiTag, FiUser } from "react-icons/fi";
import Footer from "../components/footer";

function ProfileRow({ icon: Icon, title, subtitle }) {
    return (
        <button
            type="button"
            className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-gray-50 transition-colors"
        >
            <span className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                <Icon size={16} />
            </span>
            <span className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">{title}</p>
                {subtitle ? <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p> : null}
            </span>
            <FiChevronRight className="text-gray-400" size={18} />
        </button>
    );
}

function ProfilePage() {
    const navigate = useNavigate();
    const userId = localStorage.getItem("client_user_id") || localStorage.getItem("user_id") || "";
    const userName = localStorage.getItem("user_name") || "";
    const isLoggedIn = Boolean(userId);

    const handleLogout = () => {
        localStorage.removeItem("client_user_id");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_name");
        navigate("/profile");
    };

    return (
        <div className="min-h-screen bg-gray-100 pb-[calc(5rem+env(safe-area-inset-bottom))]">
            <main className="max-w-md mx-auto px-3 py-4 space-y-3">
                <h1 className="text-lg font-semibold text-gray-900 px-1">My Profile</h1>

                <section className="bg-white rounded-xl border border-gray-200 p-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        {isLoggedIn ? (
                            <>
                                <p className="text-sm font-semibold text-gray-900">
                                    Hi, {userName || "User"}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">Welcome back!</p>
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-semibold text-gray-900">Account</p>
                                <p className="text-xs text-gray-500 mt-0.5">Log in to get exclusive offers</p>
                            </>
                        )}
                    </div>
                    {!isLoggedIn && (
                        <Link
                            to="/login"
                            className="shrink-0 rounded-md bg-blue-600 text-white text-xs font-semibold px-4 py-2 hover:bg-blue-700 transition-colors"
                        >
                            LOGIN
                        </Link>
                    )}
                </section>

                <section className="bg-white rounded-xl border border-gray-200 p-3">
                    <p className="text-sm font-semibold text-gray-900 mb-3">Orders & Shopping</p>
                    <div className="grid grid-cols-2 gap-2">
                        <Link to="/cart" className="rounded-lg border border-gray-200 p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                            <p className="text-xs text-gray-500">Track</p>
                            <p className="text-sm font-semibold text-gray-900 mt-1">My Orders</p>
                        </Link>
                        <button type="button" className="rounded-lg border border-gray-200 p-3 bg-gray-50 text-left hover:bg-gray-100 transition-colors">
                            <p className="text-xs text-gray-500">Saved</p>
                            <p className="text-sm font-semibold text-gray-900 mt-1">Wishlist</p>
                        </button>
                        <button type="button" className="rounded-lg border border-gray-200 p-3 bg-gray-50 text-left hover:bg-gray-100 transition-colors">
                            <p className="text-xs text-gray-500">Offers</p>
                            <p className="text-sm font-semibold text-gray-900 mt-1">Coupons</p>
                        </button>
                        <button type="button" className="rounded-lg border border-gray-200 p-3 bg-gray-50 text-left hover:bg-gray-100 transition-colors">
                            <p className="text-xs text-gray-500">Support</p>
                            <p className="text-sm font-semibold text-gray-900 mt-1">Help Center</p>
                        </button>
                    </div>
                </section>

                <section className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                    <p className="text-sm font-semibold text-gray-900 px-3 py-3">Rewards & Benefits</p>
                    <ProfileRow icon={FiGift} title="Exclusive Offers" subtitle="Get deals curated for your account" />
                    <ProfileRow icon={FiTag} title="My Coupons" subtitle="View and apply saved coupon codes" />
                    <ProfileRow icon={FiHeart} title="Saved Items" subtitle="Products you liked and saved" />
                </section>

                <section className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                    <p className="text-sm font-semibold text-gray-900 px-3 py-3">Account Settings</p>
                    <ProfileRow icon={FiUser} title="Profile Information" subtitle="Manage your personal details" />
                    <ProfileRow icon={FiMapPin} title="Addresses" subtitle="Add and edit delivery addresses" />
                    <ProfileRow icon={FiPackage} title="My Activity" subtitle="Returns, cancellations, and more" />
                    <ProfileRow icon={FiSettings} title="Preferences" subtitle="Language, notifications, and settings" />
                </section>

                <section className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                    <p className="text-sm font-semibold text-gray-900 px-3 py-3">Privacy & Support</p>
                    <ProfileRow icon={FiShield} title="Terms, Policies & Licenses" />
                    <Link to="/login">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                        >
                            Logout
                        </button>
                    </Link>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default ProfilePage;
