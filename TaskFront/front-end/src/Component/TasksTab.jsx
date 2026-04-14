import { motion, AnimatePresence } from "framer-motion";

const priorityConfig = {
  High: {
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.2)",
  },
  Medium: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.2)",
  },
  Low: {
    color: "#22c55e",
    bg: "rgba(34,197,94,0.1)",
    border: "rgba(34,197,94,0.2)",
  },
};

const statusConfig = {
  Completed: {
    color: "#22c55e",
    bg: "rgba(34,197,94,0.1)",
    border: "rgba(34,197,94,0.25)",
    dot: "#22c55e",
  },
  "In Progress": {
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.1)",
    border: "rgba(59,130,246,0.25)",
    dot: "#3b82f6",
  },
  "Not Started": {
    color: "#9ca3af",
    bg: "rgba(156,163,175,0.1)",
    border: "rgba(156,163,175,0.25)",
    dot: "#d1d5db",
  },
};

function TaskCard({ task, onEdit, onDelete }) {
  const priority = priorityConfig[task.priority] || priorityConfig.Low;
  const status = statusConfig[task.status] || statusConfig["Not Started"];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -4 }}
      className="relative rounded-2xl p-5 border border-white/40 flex flex-col gap-3"
      style={{
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow:
          "0 4px 24px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)",
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-800 text-base leading-snug flex-1">
          {task.title}
        </h3>
        <span
          className="text-xs px-2.5 py-1 rounded-full font-medium shrink-0 flex items-center gap-1"
          style={{
            background: status.bg,
            color: status.color,
            border: `1px solid ${status.border}`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ background: status.dot }}
          />
          {task.status}
        </span>
      </div>

      {/* Priority + date */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="text-xs px-2.5 py-1 rounded-full font-medium"
          style={{
            background: priority.bg,
            color: priority.color,
            border: `1px solid ${priority.border}`,
          }}
        >
          {task.priority} Priority
        </span>
        {task.endDate && (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <span>📅</span> {task.endDate}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="flex-1 text-sm py-2 rounded-xl font-medium transition-all"
          style={{
            background: "rgba(59,130,246,0.08)",
            color: "#3b82f6",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(59,130,246,0.15)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(59,130,246,0.08)")
          }
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="flex-1 text-sm py-2 rounded-xl font-medium transition-all"
          style={{
            background: "rgba(239,68,68,0.08)",
            color: "#ef4444",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(239,68,68,0.15)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(239,68,68,0.08)")
          }
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
}

function TasksTab({ tasks, startEdit, deleteTask }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Tasks</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <span className="text-xs text-gray-400 font-medium bg-white/60 border border-white/40 px-3 py-1.5 rounded-full backdrop-blur">
          {tasks.filter((t) => t.status === "Completed").length} completed
        </span>
      </div>

      {tasks.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center border border-white/40"
          style={{
            background: "rgba(255,255,255,0.5)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div className="text-4xl mb-3">🚀</div>
          <p className="text-gray-500 font-medium">No tasks yet.</p>
          <p className="text-gray-400 text-sm mt-1">
            Add your first task to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={startEdit}
                onDelete={deleteTask}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

export default TasksTab;
