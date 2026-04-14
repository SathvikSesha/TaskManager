import { motion } from "framer-motion";

function HomeCard({ title, desc, action, icon, accent }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={action}
      className="cursor-pointer relative overflow-hidden rounded-2xl p-6 border border-white/30"
      style={{
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
      }}
    >
      <div
        className="absolute inset-0 opacity-10 rounded-2xl"
        style={{ background: accent }}
      />
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4"
        style={{ background: accent + "22", border: `1.5px solid ${accent}44` }}
      >
        {icon}
      </div>
      <h3 className="text-base font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
      <div
        className="mt-4 flex items-center gap-1 text-xs font-medium"
        style={{ color: accent }}
      >
        Get started <span className="ml-1">→</span>
      </div>
    </motion.div>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div
      className="flex flex-col items-center justify-center px-6 py-4 rounded-2xl border border-white/40"
      style={{
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <span className="text-2xl font-bold" style={{ color }}>
        {value}
      </span>
      <span className="text-xs text-gray-500 mt-0.5">{label}</span>
    </div>
  );
}

function HomeTab({ user, tasks, setActiveTab }) {
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const notStarted = tasks.filter((t) => t.status === "Not Started").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Welcome header */}
      <div>
        <p className="text-sm text-blue-500 font-medium mb-1">Good day 👋</p>
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user.name}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Here's what's happening with your tasks today.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <StatPill label="Completed" value={completed} color="#22c55e" />
        <StatPill label="In Progress" value={inProgress} color="#3b82f6" />
        <StatPill label="Not Started" value={notStarted} color="#f59e0b" />
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Quick Actions
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <HomeCard
            title="Add New Task"
            desc="Create tasks with priority and due date."
            action={() => setActiveTab("add")}
            icon="✦"
            accent="#3b82f6"
          />
          <HomeCard
            title="View My Tasks"
            desc="Track progress of your ongoing work."
            action={() => setActiveTab("tasks")}
            icon="◈"
            accent="#8b5cf6"
          />
          <HomeCard
            title="Stay Consistent"
            desc="Build habits and finish tasks on time."
            action={() => setActiveTab("add")}
            icon="⬡"
            accent="#06b6d4"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default HomeTab;
