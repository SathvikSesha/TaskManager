import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { motion } from "framer-motion";
import HomeCard from "../Component/HomeCard";
import AddTask from "../Component/AddTask";
import api from "../api/axios";

function Dashboard() {
  const { user, logout } = useAuth();
  const [editingTask, setEditingTask] = useState(null);

  const [activeTab, setActiveTab] = useState("home");

  const [tasks, setTasks] = useState([]);

  const [form, setForm] = useState({
    title: "",
    endDate: "",
    priority: "Low",
    status: "Not Started",
  });

  const startEdit = (task) => {
    setEditingTask(task);

    setForm({
      title: task.title || "",
      endDate: task.endDate || "",
      priority: task.priority || "Low",
      status: task.status || "Not Started",
    });

    setActiveTab("add");
  };

  const updateTask = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/tasks/${editingTask.id}`, {
        task_name: form.title,
        end_date: form.endDate || null,
        priority: form.priority,
        status: form.status,
      });

      await fetchTasks();

      setEditingTask(null);
      setActiveTab("tasks");

      setForm({
        title: "",
        endDate: "",
        priority: "Low",
        status: "Not Started",
      });
    } catch (err) {
      console.error("Update task failed", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");

      // Map backend → frontend shape
      const mappedTasks = res.data.map((t) => ({
        id: t.id,
        title: t.task_name,
        endDate: t.end_date,
        priority: t.priority,
        status: t.status,
      }));

      setTasks(mappedTasks);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    try {
      await api.post("/tasks", {
        task_name: form.title,
        end_date: form.endDate || null,
        priority: form.priority,
        status: form.status,
      });

      await fetchTasks();

      setForm({
        title: "",
        endDate: "",
        priority: "Low",
        status: "Not Started",
      });

      setActiveTab("tasks");
    } catch (err) {
      console.error("Add task failed", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      await fetchTasks();
    } catch (err) {
      console.error("Delete task failed", err);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-[15%] min-w-[200px] bg-slate-900 text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-10">RoutineIQ</h2>

        <button
          onClick={() => setActiveTab("home")}
          className={`mb-4 text-left ${
            activeTab === "home" ? "text-blue-400" : ""
          }`}
        >
          Home
        </button>

        <button
          onClick={() => setActiveTab("add")}
          className={`mb-4 text-left ${
            activeTab === "add" ? "text-blue-400" : ""
          }`}
        >
          Add Task
        </button>

        <button
          onClick={() => setActiveTab("tasks")}
          className={`mb-4 text-left ${
            activeTab === "tasks" ? "text-blue-400" : ""
          }`}
        >
          My Tasks
        </button>

        <div className="mt-auto">
          <p className="mb-4 text-sm text-gray-300">Hello, {user.name}</p>
          <button
            onClick={logout}
            className="bg-red-500 px-4 py-2 rounded-md w-full"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN SECTION */}
      <main className="flex-1 p-10">
        {activeTab === "home" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user.name} 👋
              </h1>
              <p className="text-gray-600">
                Let’s organize your day and stay productive.
              </p>
            </div>

            {/* HOME CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <HomeCard
                title="Add New Task"
                desc="Create tasks with priority and due date."
                action={() => setActiveTab("add")}
                color="from-blue-500 to-blue-600"
              />

              <HomeCard
                title="View My Tasks"
                desc="Track progress of your ongoing work."
                action={() => setActiveTab("tasks")}
                color="from-green-500 to-green-600"
              />

              <HomeCard
                title="Stay Consistent"
                desc="Build habits and finish tasks on time."
                action={() => setActiveTab("add")}
                color="from-purple-500 to-purple-600"
              />
            </div>
          </motion.div>
        )}
        {activeTab === "add" && (
          <AddTask
            form={form}
            handleChange={handleChange}
            onSubmit={editingTask ? updateTask : addTask}
            isEditing={!!editingTask}
          />
        )}

        {activeTab === "tasks" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-semibold mb-1">My Tasks</h2>
              <p className="text-gray-500 text-sm">
                Manage, update, and track your progress
              </p>
            </div>

            {tasks.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center text-gray-500">
                No tasks yet. Add your first task 🚀
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    whileHover={{ y: -4 }}
                    className="bg-white p-5 rounded-2xl shadow-md space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{task.title}</h3>
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          task.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : task.status === "In Progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500">
                      Priority:{" "}
                      <span
                        className={`font-medium ${
                          task.priority === "High"
                            ? "text-red-500"
                            : task.priority === "Medium"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </p>

                    {task.endDate && (
                      <p className="text-xs text-gray-400">
                        Due: {task.endDate}
                      </p>
                    )}

                    <div className="flex gap-3 pt-3">
                      <button
                        onClick={() => startEdit(task)}
                        className="flex-1 text-sm bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="flex-1 text-sm bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
