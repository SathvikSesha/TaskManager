import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";

function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); // "error" | "success"

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => {
      setMsg("");
      setMsgType("");
    }, 3000);
    return () => clearTimeout(t);
  }, [msg]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const showError = (message) => {
    setMsg(message);
    setMsgType("error");
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (form.name.length < 4)
      return showError("Username must be at least 4 characters");
    if (!form.email) return showError("Email is required");
    if (form.password.length < 6)
      return showError("Password must be at least 6 characters");
    if (form.password !== form.confirm)
      return showError("Passwords do not match");

    try {
      await api.post("/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setMsg("Account created successfully! Redirecting...");
      setMsgType("success");

      // 1-second laziness before navigation
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.log("Signup error:", err.response || err);
      showError(err.response?.data?.message || "Registration failed");
    } finally {
      if (msgType !== "success") setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden
      bg-gradient-to-br from-blue-50 via-white to-blue-100 font-sans"
    >
      {/* NAVBAR */}
      <nav
        className="absolute top-0 left-0 w-full z-20
        flex items-center justify-between px-5 py-6 md:px-10"
      >
        <motion.h2
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-xl md:text-2xl font-bold text-gray-900"
        >
          Task.ly
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Link
            to="/"
            className="text-gray-600 hover:text-black font-medium transition-colors"
          >
            Home
          </Link>
        </motion.div>
      </nav>

      {/* Background glow */}
      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full -top-40 -left-40 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full bottom-0 right-0 pointer-events-none" />

      {/* Floating Cards (Background Decoration Only) */}
      <FloatingCard
        title="Create Task"
        color="bg-blue-500"
        style="left-[10%] top-[30%]"
        delay={0}
      />
      <FloatingCard
        title="Track Progress"
        color="bg-green-500"
        style="right-[10%] top-[30%]"
        delay={0.5}
      />
      <FloatingCard
        title="Stay Organized"
        color="bg-yellow-500"
        style="left-[5%] top-[60%]"
        delay={1}
      />
      <FloatingCard
        title="Achieve Goals"
        color="bg-purple-500"
        style="right-[5%] top-[60%]"
        delay={1.5}
      />

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16"
      >
        <div
          className="w-full max-w-md px-6 py-8 rounded-3xl
          bg-white/70 backdrop-blur-xl border border-white/50
          shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1.5">
              Create Account
            </h1>
            <p className="text-gray-500 text-sm">
              Join RoutineIQ and organize your work better
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-white/50 border border-white/40 
              text-gray-800 placeholder-gray-400 outline-none transition-all duration-300
              focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 shadow-sm"
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-white/50 border border-white/40 
              text-gray-800 placeholder-gray-400 outline-none transition-all duration-300
              focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 shadow-sm"
            />

            {/* SIDE BY SIDE PASSWORDS */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full sm:w-1/2 px-4 py-2.5 text-sm rounded-xl bg-white/50 border border-white/40 
                text-gray-800 placeholder-gray-400 outline-none transition-all duration-300
                focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 shadow-sm"
              />

              <input
                name="confirm"
                type="password"
                placeholder="Confirm Password"
                value={form.confirm}
                onChange={handleChange}
                className="w-full sm:w-1/2 px-4 py-2.5 text-sm rounded-xl bg-white/50 border border-white/40 
                text-gray-800 placeholder-gray-400 outline-none transition-all duration-300
                focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 shadow-sm"
              />
            </div>

            {msg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className={`text-center text-xs font-medium py-2 rounded-lg mt-1 ${
                  msgType === "success"
                    ? "bg-green-50 text-green-600 border border-green-200"
                    : "bg-red-50 text-red-600 border border-red-200"
                }`}
              >
                {msg}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-xl text-sm font-semibold text-white
              bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 
              shadow-lg shadow-blue-500/30 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </motion.button>
          </form>

          {/* OAUTH SECTION */}
          <div className="mt-6">
            <div className="relative flex items-center justify-center">
              <span className="absolute bg-transparent px-3 text-[11px] text-gray-400 font-medium tracking-wider uppercase">
                Or Continue With
              </span>
              <div className="w-full border-t border-gray-200/80"></div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              className="w-full mt-5 py-2.5 px-4 rounded-xl text-sm font-medium text-gray-700
              bg-white border border-gray-200/80 hover:bg-gray-50 hover:shadow-sm
              transition-all flex items-center justify-center gap-2.5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </motion.button>
          </div>

          <p className="mt-6 text-center text-gray-500 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors cursor-pointer"
            >
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* FLOATING CARD - Background Only */
function FloatingCard({ title, color, style, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -15, 0] }}
      transition={{ delay, duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute ${style} ${color} text-white px-5 py-3 text-sm font-medium
        rounded-xl shadow-lg hidden lg:block opacity-80 pointer-events-none`}
    >
      {title}
    </motion.div>
  );
}

export default SignUp;
