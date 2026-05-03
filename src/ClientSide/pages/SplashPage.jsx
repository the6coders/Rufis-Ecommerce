import { useMemo, useState } from "react";
import { FiArrowRight, FiShield, FiShoppingBag, FiTruck } from "react-icons/fi";

function SplashPage({ onFinish }) {
    const slides = useMemo(
        () => [
            {
                title: "Shop Fresh Styles Daily",
                subtitle:
                    "Explore curated fashion, gadgets, and essentials designed for your lifestyle.",
                accent: "from-rose-500 to-orange-400",
                icon: FiShoppingBag,
                chips: ["New Arrivals", "Top Rated", "Limited Deals"],
            },
            {
                title: "Lightning Fast Delivery",
                subtitle:
                    "Track your orders in real time and receive your picks exactly when you need them.",
                accent: "from-blue-500 to-cyan-400",
                icon: FiTruck,
                chips: ["Live Tracking", "Same Day", "Easy Returns"],
            },
            {
                title: "Safe Payments, Zero Stress",
                subtitle:
                    "Checkout securely with trusted payment protection and smooth refunds.",
                accent: "from-emerald-500 to-lime-400",
                icon: FiShield,
                chips: ["Secure Checkout", "Protected Wallet", "Instant Support"],
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
            return;
        }
        setActiveIndex((prev) => prev + 1);
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-950 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#1d4ed8_0%,#020617_42%,#020617_100%)]" />
            <div className="absolute -top-24 -left-16 w-56 h-56 rounded-full bg-fuchsia-500/25 blur-3xl" />
            <div className="absolute bottom-0 -right-16 w-64 h-64 rounded-full bg-cyan-400/20 blur-3xl" />

            <main className="relative z-10 min-h-screen max-w-md mx-auto px-5 py-8 flex flex-col">
                <div className="flex items-center justify-between">
                    <p className="text-[11px] uppercase tracking-[0.35em] text-slate-300">Rufis E-Commerce</p>
                    <button
                        type="button"
                        onClick={onFinish}
                        className="text-sm font-medium text-slate-200/90 hover:text-white transition"
                    >
                        Skip
                    </button>
                </div>

                <div className="mt-12 rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-5 shadow-2xl">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${currentSlide.accent} flex items-center justify-center`}>
                        <Icon size={26} />
                    </div>

                    <h1 className="mt-6 text-3xl leading-tight font-black tracking-tight">
                        {currentSlide.title}
                    </h1>
                    <p className="mt-3 text-sm leading-relaxed text-slate-200">
                        {currentSlide.subtitle}
                    </p>

                    <div className="mt-6 grid grid-cols-3 gap-2">
                        {currentSlide.chips.map((chip) => (
                            <div
                                key={chip}
                                className="text-[11px] text-center px-2 py-2 rounded-xl border border-white/20 bg-white/5"
                            >
                                {chip}
                            </div>
                        ))}
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
                                activeIndex === index ? "w-8 h-2 bg-white" : "w-2 h-2 bg-white/40"
                            }`}
                        />
                    ))}
                </div>

                <div className="mt-auto pt-8">
                    <button
                        type="button"
                        onClick={handleNext}
                        className="w-full rounded-2xl bg-white text-slate-900 py-3.5 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition"
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
