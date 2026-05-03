import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { createUser, extractObject } from "../../api/services";

function SignupPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirm) {
            setError("Passwords do not match.");
            return;
        }

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setSubmitting(true);

        try {
            const [first_name, ...rest] = form.name.trim().split(" ");
            const last_name = rest.join(" ") || "User";

            // users info
            const userData = {
                first_name,
                last_name,
                email: form.email,
                phone: form.phone,
                password: form.password,
            };

            const response = await createUser(userData);

            const data = extractObject(response.data);
            const userId = data.id || data.user_id || data._id || data.user?.id || "";
            console.log("Created user data:", data);
            const userName = first_name;

            if (userId) {
                localStorage.setItem("user_id", String(userId));
                localStorage.setItem("client_user_id", String(userId));
            }
            if (userName) {
                localStorage.setItem("user_name", userName);
            }

            navigate("/login");
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                (typeof err?.response?.data === "string" ? err.response.data : "") ||
                "Sign up failed. Please try again.";
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 pb-8">
            <div className="w-full max-w-sm space-y-5">

                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
                    <p className="text-sm text-gray-500 mt-1">Sign up to shop and get exclusive offers</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
                    {error ? (
                        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    ) : null}

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Full name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={onChange}
                                required
                                placeholder="John Doe"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Email address</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={onChange}
                                required
                                placeholder="you@example.com"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Phone number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={onChange}
                                required
                                placeholder="+234 800 000 0000"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-xs font-semibold text-gray-700">Password</label>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={onChange}
                                required
                                placeholder="At least 6 characters"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-xs font-semibold text-gray-700">Confirm password</label>
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirm"
                                value={form.confirm}
                                onChange={onChange}
                                required
                                placeholder="••••••••"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full rounded-lg bg-blue-600 text-white font-semibold py-2.5 text-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
                        >
                            {submitting ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-500">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                            Login
                        </Link>
                    </p>
                </div>

                <p className="text-center text-xs text-gray-400">
                    By signing up, you agree to our Terms & Privacy Policy.
                </p>
            </div>
        </div>
    );
}

export default SignupPage;
