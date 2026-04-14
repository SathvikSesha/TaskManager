import { motion } from "framer-motion";

function PlanCard({
  plan,
  isCurrent,
  isPopular,
  onUpgrade,
  upgradeLoadingTier,
}) {
  const isLoading = upgradeLoadingTier === plan.tier;
  const disabled = isCurrent || !!upgradeLoadingTier;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: plan.index * 0.1 }}
      className="relative flex flex-col rounded-3xl p-7 border"
      style={
        isPopular
          ? {
              background: "rgba(59,130,246,0.07)",
              border: "1.5px solid rgba(59,130,246,0.35)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow:
                "0 8px 40px rgba(59,130,246,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",
              transform: "translateY(-8px)",
            }
          : {
              background: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(255,255,255,0.5)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow:
                "0 4px 24px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)",
            }
      }
    >
      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
            MOST POPULAR
          </span>
        </div>
      )}

      <div className="mb-1">
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: plan.accentBg, color: plan.accent }}
        >
          {plan.label}
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mt-3">{plan.name}</h3>
      <div className="flex items-baseline gap-1 mt-2 mb-6">
        <span className="text-4xl font-extrabold text-gray-900">
          {plan.price}
        </span>
        <span className="text-gray-400 text-sm font-normal">{plan.period}</span>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((f, i) => (
          <li
            key={i}
            className="flex items-center gap-2.5 text-sm text-gray-600"
          >
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0"
              style={{ background: plan.accentBg, color: plan.accent }}
            >
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={() => !disabled && onUpgrade(plan.tier)}
        disabled={disabled}
        className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200"
        style={
          isCurrent
            ? {
                background: "rgba(0,0,0,0.06)",
                color: "#9ca3af",
                cursor: "not-allowed",
              }
            : isPopular
              ? {
                  background: disabled ? "rgba(59,130,246,0.5)" : "#3b82f6",
                  color: "#fff",
                  boxShadow: "0 4px 16px rgba(59,130,246,0.35)",
                  cursor: disabled ? "wait" : "pointer",
                }
              : {
                  background: disabled ? "rgba(0,0,0,0.06)" : plan.btnBg,
                  color: disabled ? "#9ca3af" : plan.btnColor,
                  border: `1.5px solid ${plan.btnBorder}`,
                  cursor: disabled ? "wait" : "pointer",
                }
        }
      >
        {isCurrent ? "Current Plan" : isLoading ? "Opening payment…" : plan.cta}
      </button>
    </motion.div>
  );
}

function UpgradeTab({ currentTier, handleUpgrade, upgradeLoadingTier }) {
  const plans = [
    {
      tier: "free",
      index: 0,
      name: "Free",
      label: "Starter",
      price: "₹0",
      period: "/forever",
      accent: "#6b7280",
      accentBg: "rgba(107,114,128,0.1)",
      btnBg: "rgba(107,114,128,0.08)",
      btnColor: "#6b7280",
      btnBorder: "rgba(107,114,128,0.2)",
      cta: "Get Started",
      features: ["Up to 10 active tasks", "Basic priority tags"],
    },
    {
      tier: "plus",
      index: 1,
      name: "Plus",
      label: "Popular",
      price: "₹99",
      period: "/month",
      accent: "#3b82f6",
      accentBg: "rgba(59,130,246,0.1)",
      btnBg: "rgba(59,130,246,0.08)",
      btnColor: "#3b82f6",
      btnBorder: "rgba(59,130,246,0.2)",
      cta: "Upgrade to Plus",
      features: [
        "Up to 150 active tasks",
        "Priority support",
        "Change name/password",
      ],
    },
    {
      tier: "pro",
      index: 2,
      name: "Pro",
      label: "Power User",
      price: "₹399",
      period: "/month",
      accent: "#8b5cf6",
      accentBg: "rgba(139,92,246,0.1)",
      btnBg: "rgba(15,23,42,0.9)",
      btnColor: "#fff",
      btnBorder: "transparent",
      cta: "Upgrade to Pro",
      features: [
        "Unlimited tasks (1000 limit)",
        "24/7 priority support",
        "Advanced analytics",
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 max-w-5xl mx-auto"
    >
      <div className="text-center">
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-2">
          Pricing Plans
        </p>
        <h2 className="text-3xl font-bold text-gray-800">
          Supercharge Your Productivity
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Choose the perfect plan to hit your goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start pt-4">
        {plans.map((plan) => (
          <PlanCard
            key={plan.tier}
            plan={plan}
            isCurrent={currentTier === plan.tier}
            isPopular={plan.tier === "plus"}
            onUpgrade={handleUpgrade}
            upgradeLoadingTier={upgradeLoadingTier}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default UpgradeTab;
