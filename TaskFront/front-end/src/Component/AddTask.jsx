import { motion } from "framer-motion";

function AddTask({ form, handleChange, onSubmit, isEditing }) {
  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-2xl shadow-lg max-w-xl space-y-6"
    >
      <div>
        <h2 className="text-2xl font-semibold mb-1">
          {isEditing ? "Edit Task ✏️" : "Create a Task ✨"}
        </h2>
        <p className="text-gray-500 text-sm">
          {isEditing
            ? "Update the details of your task"
            : "Fill the details below to add a new task"}
        </p>
      </div>

      {/* TASK TITLE */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Task Title
        </label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Eg: Complete React project"
          className="w-full px-4 py-3 border rounded-lg
          focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* DATE */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Due Date
        </label>
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          className="w-full px-4 py-3 border rounded-lg
          focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* PRIORITY & STATUS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg
            focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-xl
        font-semibold hover:bg-blue-500 transition"
      >
        {isEditing ? "Update Task" : "Add Task"}
      </button>
    </motion.form>
  );
}

export default AddTask;
