import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import AddTask from "../Component/AddTask";
import api from "../api/axios";
import "./dashboard.css";

import HomeTab from "../Component/HomeCard";
import TasksTab from "../Component/TasksTab";
import UpgradeTab from "../Component/UpgradeTab";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const NAV = [
  { id: "home", label: "Home", icon: "⌂" },
  { id: "add", label: "Add Task", icon: "+" },
  { id: "tasks", label: "My Tasks", icon: "◈" },
  { id: "upgrade", label: "Upgrade", icon: "⚡", accent: true },
];

function NavBtn({ item, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`nav-btn 
        ${active ? "active" : ""} 
        ${item.accent ? "nav-btn-yellow" : "nav-btn-blue"}`}
    >
      <span
        className={`nav-icon 
          ${active ? (item.accent ? "active-yellow" : "active-blue") : ""}`}
      >
        {item.icon}
      </span>
      {item.label}
    </button>
  );
}

function Toast({ toast }) {
  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-xl">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        className={`rounded-xl px-5 py-3 backdrop-blur-md border text-sm font-medium
          ${
            isSuccess
              ? "bg-green-50/90 text-green-800 border-green-400/30"
              : "bg-red-50/90 text-red-800 border-red-400/30"
          }`}
      >
        {toast.message}
      </motion.div>
    </div>
  );
}

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
      if (err.response?.status === 403 && err.response?.data?.limitReached) {
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
            const verifyRes = await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              tier: selectedTier,
            });

            if (verifyRes?.data?.user) updateUser(verifyRes.data.user);

            setToast({
              type: "success",
              message: verifyRes.data?.message || "Payment successful!",
            });

            setActiveTab("upgrade");
          } catch {
            setToast({
              type: "error",
              message: "Payment verification failed! Contact support.",
            });
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: "#3B82F6" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch {
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
    <div className="dashboard-container">
      {/* Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="bg-blur bg-1 opacity-35"></div>
        <div className="bg-blur bg-2 opacity-25"></div>
        <div className="bg-blur bg-3 opacity-20"></div>
      </div>

      <AnimatePresence>{toast && <Toast toast={toast} />}</AnimatePresence>

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">
          Task<span>.ly</span>
        </h2>

        <nav className="flex-1">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-2 pl-2">
            Menu
          </p>

          {NAV.map((item) => (
            <NavBtn
              key={item.id}
              item={item}
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            />
          ))}
        </nav>

        <div className="border-t border-white/10 pt-4 mt-4">
          <div className="user-box">
            <div className="avatar">{user.name?.[0]?.toUpperCase()}</div>

            <div>
              <p className="text-white text-sm font-medium">{user.name}</p>
              <p className="text-white/40 text-xs">
                {currentTier.toUpperCase()}
              </p>
            </div>
          </div>

          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <HomeTab
              key="home"
              user={user}
              tasks={tasks}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "add" && (
            <motion.div
              key="add"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <AddTask
                form={form}
                handleChange={handleChange}
                onSubmit={editingTask ? updateTask : addTask}
                isEditing={!!editingTask}
              />
            </motion.div>
          )}

          {activeTab === "tasks" && (
            <TasksTab
              key="tasks"
              tasks={tasks}
              startEdit={startEdit}
              deleteTask={deleteTask}
            />
          )}

          {activeTab === "upgrade" && (
            <UpgradeTab
              key="upgrade"
              currentTier={currentTier}
              handleUpgrade={handleUpgrade}
              upgradeLoadingTier={upgradeLoadingTier}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default Dashboard;
