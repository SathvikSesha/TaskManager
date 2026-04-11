import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { motion } from "framer-motion";
import HomeCard from "../Component/HomeCard";
import AddTask from "../Component/AddTask";
import api from "../api/axios";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function Dashboard() {
  const { user, logout, updateUser } = useAuth();

  const [editingTask, setEditingTask] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [tasks, setTasks] = useState([]);
  const [toast, setToast] = useState(null);
  const [upgradeLoadingTier, setUpgradeLoadingTier] = useState(null);

  const [form, setForm] = useState({
    title: "",
    endDate: "",
    priority: "Low",
    status: "Not Started",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      const mappedTasks = res.data.map((t) => ({
        id: t._id,
        title: t.title,
        endDate: t.endDate
          ? new Date(t.endDate).toISOString().split("T")[0]
          : "",
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
      await api.patch(`/tasks/${editingTask.id}`, {
        title: form.title,
        endDate: form.endDate || null,
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

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      await fetchTasks();
    } catch (err) {
      console.error("Delete task failed", err);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    try {
      await api.post("/tasks", {
        title: form.title,
        endDate: form.endDate || null,
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
      if (
        err.response &&
        err.response.status === 403 &&
        err.response.data.limitReached
      ) {
        setToast({ type: "error", message: err.response.data.message });
        setActiveTab("upgrade");
      } else {
        console.error("Add task failed", err);
      }
    }
  };

  const handleUpgrade = async (selectedTier) => {
    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      setToast({
        type: "error",
        message:
          "Failed to load Razorpay. Please check your internet connection.",
      });
      return;
    }

    try {
      setUpgradeLoadingTier(selectedTier);
      const { data: order } = await api.post("/payment/create-order", {
        tier: selectedTier,
      });
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Task.ly",
        description: `Upgrade to ${selectedTier.toUpperCase()} Plan`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // 3. Send success signature back to backend for verification
            const verifyRes = await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              tier: selectedTier,
            });

            if (verifyRes?.data?.user) {
              updateUser(verifyRes.data.user);
            }
            setToast({
              type: "success",
              message: verifyRes.data?.message || "Payment successful!",
            });
            setActiveTab("upgrade");
          } catch (err) {
            setToast({
              type: "error",
              message: "Payment verification failed! Contact support.",
            });
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#3B82F6" }, // Task.ly blue
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Upgrade process failed", error);
      setToast({ type: "error", message: "Could not start payment process." });
    } finally {
      setUpgradeLoadingTier(null);
    }
  };

  const currentTier = (
    user?.tier ||
    user?.subscriptionTier ||
    "free"
  ).toLowerCase();

  return (
    <div className="min-h-screen flex bg-gray-100 flex-col md:flex-row font-sans">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className={`rounded-xl px-4 py-3 shadow-lg border backdrop-blur-md ${
              toast.type === "success"
                ? "bg-green-50/90 border-green-200 text-green-800"
                : "bg-red-50/90 border-red-200 text-red-800"
            }`}
          >
            <div className="text-sm font-semibold">{toast.message}</div>
          </motion.div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-full md:w-[240px] bg-slate-900 text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-10">Task.ly</h2>

        <button
          onClick={() => setActiveTab("home")}
          className={`mb-4 text-left px-3 py-2 rounded-md transition ${activeTab === "home" ? "bg-slate-800 text-blue-400" : "hover:bg-slate-800"}`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab("add")}
          className={`mb-4 text-left px-3 py-2 rounded-md transition ${activeTab === "add" ? "bg-slate-800 text-blue-400" : "hover:bg-slate-800"}`}
        >
          Add Task
        </button>
        <button
          onClick={() => setActiveTab("tasks")}
          className={`mb-4 text-left px-3 py-2 rounded-md transition ${activeTab === "tasks" ? "bg-slate-800 text-blue-400" : "hover:bg-slate-800"}`}
        >
          My tasks
        </button>

        {/* 🔹 NEW UPGRADE BUTTON IN SIDEBAR */}
        <button
          onClick={() => setActiveTab("upgrade")}
          className={`mb-4 text-left font-bold px-3 py-2 rounded-md transition ${
            activeTab === "upgrade"
              ? "bg-yellow-500/20 text-yellow-400"
              : "text-yellow-500 hover:bg-slate-800"
          }`}
        >
          Upgrade Plan
        </button>

        <div className="mt-auto">
          <div className="mb-4">
            <p className="text-sm text-gray-300">Hello, {user.name}</p>
            <p className="text-[11px] text-gray-400 mt-1">
              Tier:{" "}
              <span className="font-semibold text-gray-200">
                {currentTier.toUpperCase()}
              </span>
            </p>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md w-full transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-10 overflow-y-auto">
        {activeTab === "home" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* ... Your existing Home content ... */}
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user.name} 👋
              </h1>
              <p className="text-gray-600">
                Let’s organize your day and stay productive.
              </p>
            </div>
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
            {/* ... Your existing Tasks content ... */}
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
                        className={`text-xs px-3 py-1 rounded-full ${task.status === "Completed" ? "bg-green-100 text-green-700" : task.status === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
                      >
                        {task.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Priority:{" "}
                      <span
                        className={`font-medium ${task.priority === "High" ? "text-red-500" : task.priority === "Medium" ? "text-yellow-600" : "text-green-600"}`}
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

        {/* 🔹 NEW UPGRADE UI SECTION */}
        {activeTab === "upgrade" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-5xl mx-auto"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-3 text-gray-800">
                Supercharge Your Productivity
              </h2>
              <p className="text-gray-500">
                Choose the perfect plan to hit your goals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              {/* FREE TIER */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col relative">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Free Tier
                </h3>
                <p className="text-4xl font-bold mb-6">
                  ₹0
                  <span className="text-lg text-gray-400 font-normal">
                    /forever
                  </span>
                </p>
                <ul className="space-y-4 mb-8 text-gray-600 flex-1">
                  <li className="flex items-center gap-2">
                    ✅ Up to 10 Active Tasks
                  </li>
                  <li className="flex items-center gap-2">
                    ✅ Basic Priority Tags
                  </li>
                </ul>
                <button
                  disabled
                  className="w-full py-3 rounded-xl bg-gray-100 text-gray-500 font-semibold cursor-not-allowed"
                >
                  {currentTier === "free" ? "Current Plan" : "Not available"}
                </button>
              </div>

              {/* PLUS TIER */}
              <div className="bg-gradient-to-b from-blue-50 to-white p-8 rounded-3xl shadow-lg border border-blue-100 flex flex-col relative transform md:-translate-y-4">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-sm">
                  MOST POPULAR
                </div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2">
                  Plus Tier
                </h3>
                <p className="text-4xl font-bold mb-6">
                  ₹99
                  <span className="text-lg text-gray-400 font-normal">
                    /month
                  </span>
                </p>
                <ul className="space-y-4 mb-8 text-gray-600 flex-1">
                  <li className="flex items-center gap-2">
                    ✅ Up to 150 Active Tasks
                  </li>
                  <li className="flex items-center gap-2">
                    ✅ Priority Support
                  </li>
                  <li className="flex items-center gap-2">
                    ✅ Change Name/Password
                  </li>
                </ul>
                <button
                  onClick={() => handleUpgrade("plus")}
                  disabled={currentTier === "plus" || !!upgradeLoadingTier}
                  className={`w-full py-3 rounded-xl font-semibold shadow-md transition ${
                    currentTier === "plus"
                      ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  } ${upgradeLoadingTier ? "opacity-70 cursor-wait" : ""}`}
                >
                  {currentTier === "plus"
                    ? "Current Plan"
                    : upgradeLoadingTier === "plus"
                      ? "Opening payment..."
                      : "Upgrade to Plus"}
                </button>
              </div>

              {/* PRO TIER */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col relative">
                <h3 className="text-xl font-semibold text-purple-700 mb-2">
                  Pro Tier
                </h3>
                <p className="text-4xl font-bold mb-6">
                  ₹399
                  <span className="text-lg text-gray-400 font-normal">
                    /month
                  </span>
                </p>
                <ul className="space-y-4 mb-8 text-gray-600 flex-1">
                  <li className="flex items-center gap-2">
                    ✅ Unlimited Tasks (1000 limit)
                  </li>
                  <li className="flex items-center gap-2">
                    ✅ 24/7 Priority Support
                  </li>
                  <li className="flex items-center gap-2">
                    ✅ Advanced Analytics
                  </li>
                </ul>
                <button
                  onClick={() => handleUpgrade("pro")}
                  disabled={currentTier === "pro" || !!upgradeLoadingTier}
                  className={`w-full py-3 rounded-xl font-semibold shadow-md transition ${
                    currentTier === "pro"
                      ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  } ${upgradeLoadingTier ? "opacity-70 cursor-wait" : ""}`}
                >
                  {currentTier === "pro"
                    ? "Current Plan"
                    : upgradeLoadingTier === "pro"
                      ? "Opening payment..."
                      : "Upgrade to Pro"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
