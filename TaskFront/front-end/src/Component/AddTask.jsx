import { motion } from "framer-motion";

const inputStyle = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: "12px",
  border: "1px solid rgba(0,0,0,0.1)",
  background: "rgba(255,255,255,0.7)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  outline: "none",
  fontSize: "0.9rem",
  color: "#1f2937",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

function GlassInput({ label, children }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "0.75rem",
          fontWeight: 600,
          color: "#6b7280",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          marginBottom: "6px",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function AddTask({ form, handleChange, onSubmit, isEditing }) {
  const focusStyle = (e) => {
    e.target.style.borderColor = "rgba(59,130,246,0.5)";
    e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)";
    e.target.style.background = "rgba(255,255,255,0.9)";
  };
  const blurStyle = (e) => {
    e.target.style.borderColor = "rgba(0,0,0,0.1)";
    e.target.style.boxShadow = "none";
    e.target.style.background = "rgba(255,255,255,0.7)";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl"
    >
      <form
        onSubmit={onSubmit}
        style={{
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow:
            "0 8px 40px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
          padding: "2rem",
        }}
      >
        {/* Header */}
        <div className="mb-7">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4"
            style={{
              background: isEditing
                ? "rgba(139,92,246,0.12)"
                : "rgba(59,130,246,0.12)",
              border: isEditing
                ? "1.5px solid rgba(139,92,246,0.25)"
                : "1.5px solid rgba(59,130,246,0.25)",
            }}
          >
            {isEditing ? "✏️" : "✦"}
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? "Edit Task" : "Create a Task"}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {isEditing
              ? "Update the details of your task"
              : "Fill the details below to add a new task"}
          </p>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {/* Title */}
          <GlassInput label="Task Title">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Complete React project"
              style={inputStyle}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </GlassInput>

          {/* Date */}
          <GlassInput label="Due Date">
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              style={inputStyle}
              onFocus={focusStyle}
              onBlur={blurStyle}
            />
          </GlassInput>

          {/* Priority + Status */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <GlassInput label="Priority">
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                style={inputStyle}
                onFocus={focusStyle}
                onBlur={blurStyle}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </GlassInput>

            <GlassInput label="Status">
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                style={inputStyle}
                onFocus={focusStyle}
                onBlur={blurStyle}
              >
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </GlassInput>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: "14px",
              fontWeight: 600,
              fontSize: "0.9rem",
              background: isEditing
                ? "linear-gradient(135deg, #8b5cf6, #6d28d9)"
                : "linear-gradient(135deg, #3b82f6, #2563eb)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              boxShadow: isEditing
                ? "0 4px 16px rgba(139,92,246,0.35)"
                : "0 4px 16px rgba(59,130,246,0.35)",
              marginTop: "0.5rem",
            }}
          >
            {isEditing ? "Update Task" : "Add Task"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

export default AddTask;
