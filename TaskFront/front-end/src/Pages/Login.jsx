// import { useState } from "react";
// import { useAuth } from "../Context/AuthContext";
// import { useNavigate } from "react-router-dom";

// function Login() {
//   const { user, login } = useAuth();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [msg, setMsg] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!user) {
//       setMsg("User not found. Please register first.");
//       return;
//     }

//     if (user.email !== form.email || user.password !== form.password) {
//       setMsg("Invalid email or password");
//       return;
//     }

//     login(user);
//     setMsg("Login successful!");
//     navigate("/dashboard");
//   };

//   return (
//     <>
//       <div>
//         <h1>Welcom Back!!!</h1>
//         <h2>Enter your Email And password to login</h2>

//         <form onSubmit={handleSubmit}>
//           <input
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//             placeholder="Email"
//           />
//           <input
//             name="password"
//             type="password"
//             value={form.password}
//             onChange={handleChange}
//             placeholder="Password"
//           />
//           <button type="submit">Login</button>
//         </form>

//         {msg && <p>{msg}</p>}
//       </div>
//       <div className="hero-section">
//         {/*floating cards of adding and deleting the tasks we can do using the framer motion and tailwind and also translate then in z axes that looks good */}
//       </div>
//     </>
//   );
// }

// export default Login;
import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(""), 3000);
    return () => clearTimeout(t);
  }, [msg]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) return setMsg("User not found. Please sign up first.");
    if (user.email !== form.email || user.password !== form.password)
      return setMsg("Invalid email or password.");

    login(user);
    navigate("/dashboard");
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden
    bg-linear-to-br from-blue-50 via-white to-blue-100"
    >
      {/* NAVBAR */}
      <nav
        className="absolute top-0 left-0 w-full z-20 
                    flex items-center justify-between 
                    px-5 py-6 mb-10 md:px-10"
      >
        <motion.h2
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-xl md:text-2xl font-bold text-gray-900"
        >
          RoutineIQ
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-x-6 md:space-x-10"
        >
          <Link to="/" className="text-gray-600 hover:text-black font-medium">
            Home
          </Link>
        </motion.div>
      </nav>
      <div className="min-h-screen flex items-center justify-center">
        {/* Background glow */}
        <div className="absolute w-500px h-500px bg-blue-500/20 blur-[120px] rounded-full -top-40 -left-40" />
        <div className="absolute w-100 h-400px bg-purple-500/20 blur-[120px] rounded-full bottom-0 right-0" />

        {/* Floating Cards */}
        <FloatingCard
          title="Done"
          color="bg-green-500"
          style="left-[15%] top-[35%]"
          delay={0}
        />
        <FloatingCard
          title="In Progress"
          color="bg-blue-500"
          style="right-[15%] top-[40%]"
          delay={0.3}
        />
        <FloatingCard
          title="Need Review"
          color="bg-yellow-500"
          style="left-[10%] top-[55%]"
          delay={0.6}
        />
        <FloatingCard
          title="Completed"
          color="bg-red-500"
          style="right-[10%] top-[60%]"
          delay={0.9}
        />

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md px-10 py-12 rounded-3xl
          bg-white/10 backdrop-blur-xl border border-white/20
          shadow-[0_20px_50px_rgba(0,0,0,0.35)] text-white"
        >
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-900 text-center mb-2"
          >
            Welcome Back 👋
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-gray-600 text-center mb-8"
          >
            Login to continue managing your tasks
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="w-full text-amber-900 px-4 py-3 rounded-xl bg-white/70 
             border border-gray-300 outline-none
             placeholder-gray-500
             focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full text-amber-900 px-4 py-3 rounded-xl bg-white/70 
             border border-gray-300 outline-none
             placeholder-gray-500
             focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-white
                       bg-blue-600 hover:bg-blue-500 transition-all"
            >
              Login
            </button>
          </form>

          {/* Message */}
          {msg && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center text-red-500 text-sm"
            >
              {msg}
            </motion.p>
          )}

          {/* Footer */}
          <p className="mt-6 text-center text-gray-600 text-sm">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/* FLOATING CARD */
function FloatingCard({ title, color, style, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: [0, -18, 0],
      }}
      transition={{
        delay,
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      whileHover={{
        scale: 1.1,
        boxShadow: "0px 10px 20px rgba(0,0,0,0.25)",
      }}
      className={`absolute ${style} ${color} text-white px-6 py-3 
                  rounded-xl shadow-lg cursor-pointer hidden lg:block`}
    >
      {title}
    </motion.div>
  );
}

export default Login;
