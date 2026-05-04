import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiShield, FiShoppingBag, FiTruck } from "react-icons/fi";

function SplashPage({ onFinish }) {
    const navigate = useNavigate();

    const slides = useMemo(
        () => [
            {
                title: "Discover Trends That Match You",
                subtitle:
                    "Explore premium fashion, gadgets, and essentials curated around your taste.",
                accent: "from-orange-500 to-amber-400",
                icon: FiShoppingBag,
                chips: ["New Arrivals", "Top Rated", "Daily Picks"],
            },
            {
                title: "Fast Delivery, Real-Time Updates",
                subtitle:
                    "Track every order from checkout to doorstep with smooth, reliable shipping.",
                accent: "from-sky-500 to-cyan-400",
                icon: FiTruck,
                chips: ["Live Tracking", "Same Day", "Easy Returns"],
            },
            {
                title: "Secure Payments, Total Peace",
                subtitle:
                    "Checkout confidently with encrypted payments and buyer-first protection.",
                accent: "from-emerald-500 to-teal-400",
                icon: FiShield,
                chips: ["Secure Checkout", "Protected Wallet", "Support 24/7"],
            },
        ],
        []
    );

    const [activeIndex, setActiveIndex] = useState(0);

    const currentSlide = slides[activeIndex];
    const Icon = currentSlide.icon;

    const handleNext = () => {
        if (activeIndex === slides.length - 1) {
            onFinish();
            navigate("/");
            return;
        }
        setActiveIndex((prev) => prev + 1);
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#fffaf2] text-slate-900">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,#ffe6bf_0%,#fffaf2_45%,#fef3e2_100%)]" />
            <div className="absolute -top-24 -left-16 w-56 h-56 rounded-full bg-orange-300/35 blur-3xl" />
            <div className="absolute -bottom-16 -right-10 w-72 h-72 rounded-full bg-cyan-200/45 blur-3xl" />

            <main className="relative z-10 min-h-screen max-w-md mx-auto px-5 py-8 flex flex-col">
                <div className="flex items-center justify-between">
                    <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">Rufis E-Commerce</p>
                    <button
                        type="button"
                        onClick={() => {
                            onFinish();
                            navigate("/");
                        }}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                    >
                        Skip
                    </button>
                </div>

                <div className="mt-12 relative">
                    <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl bg-slate-900/10" />
                    <div className="relative rounded-3xl border border-slate-200 bg-white/90 backdrop-blur p-5 shadow-xl">
                        <div className={`w-14 h-14 rounded-2xl text-white bg-gradient-to-br ${currentSlide.accent} flex items-center justify-center`}>
                        <Icon size={26} />
                        </div>

                        <h1 className="mt-6 text-3xl leading-tight font-black tracking-tight">
                            {currentSlide.title}
                        </h1>
                        <p className="mt-3 text-sm leading-relaxed text-slate-600">
                            {currentSlide.subtitle}
                        </p>

                        <div className="mt-6 grid grid-cols-3 gap-2">
                            {currentSlide.chips.map((chip) => (
                                <div
                                    key={chip}
                                    className="text-[11px] text-center px-2 py-2 rounded-xl border border-slate-200 bg-slate-50"
                                >
                                    {chip}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex items-center gap-2 justify-center">
                    {slides.map((slide, index) => (
                        <button
                            key={slide.title}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`transition-all rounded-full ${
                                activeIndex === index ? "w-8 h-2 bg-slate-900" : "w-2 h-2 bg-slate-300"
                            }`}
                        />
                    ))}
                </div>

                <div className="mt-auto pt-8">
                    <button
                        type="button"
                        onClick={handleNext}
                        className="w-full rounded-2xl bg-slate-900 text-white py-3.5 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition"
                    >
                        {activeIndex === slides.length - 1 ? "Get Started" : "Next"}
                        <FiArrowRight size={16} />
                    </button>
                </div>
            </main>
        </div>
    );
}

export default SplashPage;
