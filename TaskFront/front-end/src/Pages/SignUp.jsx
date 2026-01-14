import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";

function SignUp() {
  const navigate = useNavigate();

  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(""), 3000);
    return () => clearTimeout(t);
  }, [msg]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.name.length < 4)
      return setMsg("Username must be at least 4 characters");

    if (!form.email) return setMsg("Email is required");

    if (form.password.length < 6)
      return setMsg("Password must be at least 6 characters");

    if (form.password !== form.confirm) return setMsg("Passwords do not match");

    try {
      await api.post("/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setMsg("Account created successfully!");
      navigate("/login");
    } catch (err) {
      console.log("Signup error:", err.response || err);
      setMsg(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden
      bg-gradient-to-br from-blue-50 via-white to-blue-100"
    >
      {/* NAVBAR */}
      <nav
        className="absolute top-0 left-0 w-full z-20
        flex items-center justify-between px-5 py-6 md:px-10"
      >
        <motion.h2
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl md:text-2xl font-bold text-gray-900"
        >
          RoutineIQ
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/" className="text-gray-600 hover:text-black font-medium">
            Home
          </Link>
        </motion.div>
      </nav>

      {/* Background glow */}
      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full -top-40 -left-40" />
      <div className="absolute w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full bottom-0 right-0" />

      {/* Floating Cards */}
      <FloatingCard
        title="Create Task"
        color="bg-blue-500"
        style="left-[10%] top-[35%]"
        delay={0}
      />
      <FloatingCard
        title="Track Progress"
        color="bg-green-500"
        style="right-[10%] top-[35%]"
        delay={0.3}
      />
      <FloatingCard
        title="Stay Organized"
        color="bg-yellow-500"
        style="left-[5%] top-[55%]"
        delay={0.6}
      />
      <FloatingCard
        title="Achieve Goals"
        color="bg-purple-500"
        style="right-[5%] top-[55%]"
        delay={0.9}
      />

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 min-h-screen flex items-center justify-center px-4"
      >
        <div
          className="w-full max-w-xl px-10 py-12 rounded-3xl
          bg-white/60 backdrop-blur-xl border border-white/30
          shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
        >
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Create Account 🚀
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Join RoutineIQ and organize your work better
          </p>

          {/* FORM GRID */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl bg-white border
                border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl bg-white border
                border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl bg-white border
                border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="confirm"
              type="password"
              placeholder="Confirm Password"
              value={form.confirm}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl bg-white border
                border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="md:col-span-2 w-full py-3 rounded-xl
                font-semibold text-white bg-blue-600
                hover:bg-blue-500 transition-all"
            >
              Sign Up
            </button>
          </form>

          {msg && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center text-red-500 text-sm"
            >
              {msg}
            </motion.p>
          )}

          <p className="mt-6 text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* FLOATING CARD */
function FloatingCard({ title, color, style, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -18, 0] }}
      transition={{ delay, duration: 4, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{
        scale: 1.12,
        boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
      }}
      className={`absolute ${style} ${color} text-white px-6 py-3
        rounded-xl shadow-lg hidden lg:block`}
    >
      {title}
    </motion.div>
  );
}

export default SignUp;
