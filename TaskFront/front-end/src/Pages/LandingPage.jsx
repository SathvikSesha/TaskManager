import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-5 py-6 md:px-10">
        <motion.h2
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeIn" }}
          className="text-xl md:text-2xl font-bold"
        >
          Task.ly
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-x-6 md:space-x-10"
        >
          <Link to="/" className="text-gray-600 hover:text-black">
            Home
          </Link>
          <Link to="/" className="text-gray-600 hover:text-black">
            About
          </Link>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-500 transition"
          >
            Login
          </Link>
        </motion.div>
      </nav>

      {/* HERO SECTION */}
      <section className="flex flex-col items-center text-center px-6 mt-10">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl md:text-5xl font-bold max-w-4xl leading-tight"
        >
          Efficient Task <br /> Management Strategies.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 text-gray-500 max-w-xl text-md md:text-xl"
        >
          Boost productivity and achieve your goals with a simple, powerful task
          management system.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 flex gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold cursor-pointer"
          >
            <Link to="/signup">Get Started</Link>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-full"
          >
            Learn More
          </motion.button>
        </motion.div>
      </section>

      {/* STATUS CARDS */}
      <section className="m-20 flex justify-center gap-6 px-6 flex-wrap">
        <StatusCard title="Done" color="green" index={0} />
        <StatusCard title="Need Review" color="yellow" index={1} />
        <StatusCard title="In Progress" color="blue" index={2} />
        <StatusCard title="New Request" color="red" index={3} />
        <StatusCard title="On Working" color="purple" index={4} />
      </section>

      {/* FOOTER */}
      <footer className="mt-auto bg-gray-100 py-10 px-5 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <h3 className="text-xl font-bold">Task.ly</h3>

          <div className="flex gap-6 text-gray-600">
            <span className="hover:text-blue-600 cursor-pointer">Privacy</span>
            <span className="hover:text-blue-600 cursor-pointer">Terms</span>
            <span className="hover:text-blue-600 cursor-pointer">Contact</span>
          </div>

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} RoutineIQ. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function StatusCard({ title, color, index }) {
  const navigate = useNavigate(); // <-- Initialize the navigation hook

  const colors = {
    green: "bg-green-100 text-green-700 ring-green-200",
    yellow: "bg-yellow-100 text-yellow-700 ring-yellow-200",
    blue: "bg-blue-100 text-blue-700 ring-blue-200",
    red: "bg-red-100 text-red-700 ring-red-200",
    purple: "bg-purple-100 text-purple-700 ring-purple-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.25, duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        onClick={() => navigate("/login")} // <-- Add onClick handler here
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.2,
        }}
        whileHover={{
          scale: 1.05,
          y: -5,
        }}
        className="w-64 bg-white/80 backdrop-blur-md border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] rounded-2xl p-5 flex items-center justify-between cursor-pointer transition-shadow duration-300"
      >
        <span
          className={`px-4 py-1.5 rounded-full text-sm font-medium ring-1 ring-inset ${colors[color]}`}
        >
          {title}
        </span>
        <div className="flex items-center gap-2 text-gray-400 text-lg">
          <motion.button
            onClick={(e) => e.stopPropagation()}
            whileHover={{ scale: 1.2, color: "#1f2937" }}
            className="transition-colors"
          >
            +
          </motion.button>
          <motion.button
            onClick={(e) => e.stopPropagation()}
            whileHover={{ scale: 1.2, color: "#1f2937" }}
            className="transition-colors pb-1"
          >
            ⋯
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default LandingPage;
