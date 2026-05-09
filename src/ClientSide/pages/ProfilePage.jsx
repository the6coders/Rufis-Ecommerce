import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiChevronRight, FiGift, FiHeart, FiMapPin, FiMoon, FiPackage, FiSettings, FiShield, FiSun, FiTag, FiUser } from "react-icons/fi";
import Footer from "../components/footer";
import { extractObject, updateUser } from "../../api/services";

function ProfileRow({ icon: Icon, title, subtitle, onClick, rightNode }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-gray-50 transition-colors"
        >
            <span className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                <Icon size={16} />
            </span>
            <span className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">{title}</p>
                {subtitle ? <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p> : null}
            </span>
            {rightNode || <FiChevronRight className="text-gray-400" size={18} />}
        </button>
    );
}

function ProfilePage() {
    const navigate = useNavigate();
    const userId = localStorage.getItem("client_user_id") || localStorage.getItem("user_id") || "";
    const userName = localStorage.getItem("user_name") || "";
    const isLoggedIn = Boolean(userId);
    const [showProfileForm, setShowProfileForm] = useState(false);
    const [showSecurityInfo, setShowSecurityInfo] = useState(false);
    const [showHelpCenter, setShowHelpCenter] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileError, setProfileError] = useState("");
    const [profileMessage, setProfileMessage] = useState("");
    const [profileForm, setProfileForm] = useState(() => ({
        fullName: localStorage.getItem("user_full_name") || localStorage.getItem("user_name") || "",
        email: localStorage.getItem("user_email") || "",
        phone: localStorage.getItem("user_phone") || "",
    }));
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light" || savedTheme === "dark") {
            return savedTheme;
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    });

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    const handleLogout = () => {
        localStorage.removeItem("client_user_id");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_full_name");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_phone");
        navigate("/profile");
    };

    const handleProfileChange = (event) => {
        const { name, value } = event.target;
        setProfileForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async (event) => {
        event.preventDefault();
        setProfileError("");
        setProfileMessage("");

        const fullName = profileForm.fullName.trim();
        const email = profileForm.email.trim();
        const phone = profileForm.phone.trim();

        if (!fullName) {
            setProfileError("Full name is required.");
            return;
        }

        if (email && !/^\S+@\S+\.\S+$/.test(email)) {
            setProfileError("Enter a valid email address.");
            return;
        }

        const [first_name, ...rest] = fullName.split(" ");
        const last_name = rest.join(" ") || "User";

        setSavingProfile(true);

        try {
            if (userId) {
                const response = await updateUser(userId, {
                    first_name,
                    last_name,
                    email,
                    phone,
                });
                const data = extractObject(response.data);
                const displayName = data?.first_name || first_name;
                localStorage.setItem("user_name", displayName);
            } else {
                localStorage.setItem("user_name", first_name);
            }

            localStorage.setItem("user_full_name", fullName);
            localStorage.setItem("user_email", email);
            localStorage.setItem("user_phone", phone);
            setProfileMessage("Profile updated successfully.");
            setShowProfileForm(false);
        } catch (err) {
            const apiMessage =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                (typeof err?.response?.data === "string" ? err.response.data : "") ||
                err?.message ||
                "Could not update profile now. Try again.";
            setProfileError(apiMessage);
        } finally {
            setSavingProfile(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 pb-[calc(5rem+env(safe-area-inset-bottom))]">
            <main className="max-w-md mx-auto px-3 py-4 space-y-3">
                <h1 className="text-lg font-semibold text-gray-900 px-1">My Profile</h1>

                <section className="bg-white rounded-xl border border-gray-100 p-3 flex items-center justify-between gap-3">
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

                <section className="bg-white rounded-xl border border-gray-100 p-3">
                    <p className="text-sm font-semibold text-gray-900 mb-3">Orders & Shopping</p>
                    <div className="grid grid-cols-2 gap-2">
                        <Link to="/cart" className="rounded-lg border border-gray-100 p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                            <p className="text-xs text-gray-500">Track</p>
                            <p className="text-sm font-semibold text-gray-900 mt-1">My Orders</p>
                        </Link>
                        <button type="button" className="rounded-lg border border-gray-100 p-3 bg-gray-50 text-left hover:bg-gray-100 transition-colors">
                            <p className="text-xs text-gray-500">Saved</p>
                            <p className="text-sm font-semibold text-gray-900 mt-1">Wishlist</p>
                        </button>
                        <button type="button" className="rounded-lg border border-gray-100 p-3 bg-gray-50 text-left hover:bg-gray-100 transition-colors">
                            <p className="text-xs text-gray-500">Offers</p>
                            <p className="text-sm font-semibold text-gray-900 mt-1">Coupons</p>
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowHelpCenter((prev) => !prev)}
                            className="rounded-lg border border-gray-100 p-3 bg-gray-50 text-left hover:bg-gray-100 transition-colors"
                        >
                            <p className="text-xs text-gray-500">Support</p>
                            <p className="text-sm font-semibold text-gray-900 mt-1">{showHelpCenter ? "Close Help" : "Help Center"}</p>
                        </button>
                    </div>
                    {showHelpCenter ? (
                        <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 p-3 space-y-3">
                            <p className="text-sm font-semibold text-blue-900">Need help with your order?</p>
                            <p className="text-xs text-blue-800">Our support team is available Monday to Saturday, 8:00 AM to 6:00 PM.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <a href="tel:+2348000000000" className="rounded-md bg-white border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 text-center hover:bg-blue-100 transition-colors">
                                    Call Support
                                </a>
                                <a href="mailto:support@rufisdata.com" className="rounded-md bg-white border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 text-center hover:bg-blue-100 transition-colors">
                                    Email Us
                                </a>
                                <button
                                    type="button"
                                    onClick={() => navigate("/cart")}
                                    className="rounded-md bg-white border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 text-center hover:bg-blue-100 transition-colors"
                                >
                                    View Cart Orders
                                </button>
                            </div>
                            <p className="text-[11px] text-blue-700">Tip: Include your order ID when contacting support for faster help.</p>
                        </div>
                    ) : null}
                </section>

                <section className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
                    <p className="text-sm font-semibold text-gray-900 px-3 py-3">Rewards & Benefits</p>
                    <ProfileRow icon={FiGift} title="Exclusive Offers" subtitle="Get deals curated for your account" />
                    <ProfileRow icon={FiTag} title="My Coupons" subtitle="View and apply saved coupon codes" />
                    <ProfileRow icon={FiHeart} title="Saved Items" subtitle="Products you liked and saved" />
                </section>

                <section className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
                    <p className="text-sm font-semibold text-gray-900 px-3 py-3">Account Settings</p>
                    <ProfileRow
                        icon={FiUser}
                        title="Profile Information"
                        subtitle="Manage your personal details"
                        onClick={() => {
                            setShowProfileForm((prev) => !prev);
                            setProfileError("");
                            setProfileMessage("");
                        }}
                        rightNode={<span className="text-xs font-semibold text-blue-600">{showProfileForm ? "Close" : "Edit"}</span>}
                    />
                    {showProfileForm ? (
                        <form onSubmit={handleSaveProfile} className="px-3 pb-3 pt-2 space-y-3 bg-gray-50 border-y border-gray-100">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Full name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={profileForm.fullName}
                                    onChange={handleProfileChange}
                                    placeholder="Your full name"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Email address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profileForm.email}
                                    onChange={handleProfileChange}
                                    placeholder="you@example.com"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={profileForm.phone}
                                    onChange={handleProfileChange}
                                    placeholder="+234..."
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {profileError ? <p className="text-xs text-red-600">{profileError}</p> : null}
                            {profileMessage ? <p className="text-xs text-green-700">{profileMessage}</p> : null}

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={savingProfile}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                                >
                                    {savingProfile ? "Saving..." : "Save changes"}
                                </button>
                            </div>
                        </form>
                    ) : null}
                    <ProfileRow icon={FiMapPin} title="Addresses" subtitle="Add and edit delivery addresses" />
                    <ProfileRow icon={FiPackage} title="My Activity" subtitle="Returns, cancellations, and more" />
                    <ProfileRow
                        icon={FiShield}
                        title="Security"
                        subtitle="Password and account protection"
                        onClick={() => setShowSecurityInfo((prev) => !prev)}
                        rightNode={<span className="text-xs font-semibold text-blue-600">{showSecurityInfo ? "Close" : "View"}</span>}
                    />
                    {showSecurityInfo ? (
                        <div className="px-3 pb-3 pt-2 bg-gray-50 border-y border-gray-100">
                            <p className="text-sm font-medium text-gray-900">Change password</p>
                            <p className="mt-1 text-xs text-gray-600">
                                Not available yet for customer accounts because the user password-change API endpoint is not implemented.
                            </p>
                            <p className="mt-2 text-xs text-gray-500">
                                Once the endpoint is available, this section will support old password, new password, and confirm password.
                            </p>
                        </div>
                    ) : null}
                    <ProfileRow icon={FiSettings} title="Preferences" subtitle="Language, notifications, and settings" />
                    <button
                        type="button"
                        onClick={() => setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"))}
                        className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                        <span className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                            {theme === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />}
                        </span>
                        <span className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">Theme</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {theme === "dark" ? "Dark mode enabled" : "Light mode enabled"}
                            </p>
                        </span>
                        <span className="text-xs font-semibold text-blue-600">
                            {theme === "dark" ? "Dark" : "Light"}
                        </span>
                    </button>
                </section>

                <section className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
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
