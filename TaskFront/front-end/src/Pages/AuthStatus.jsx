import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { motion } from "framer-motion";

export default function AuthStatus() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [hasLoggedIn, setHasLoggedIn] = useState(false);

  const error = searchParams.get("error");
  const name = searchParams.get("name");
  const email = searchParams.get("email");
  const tier = searchParams.get("tier");
  const taskLimitRaw = searchParams.get("taskLimit");
  const taskLimit = taskLimitRaw ? Number(taskLimitRaw) : undefined;

  const status = error ? "failed" : name && email ? "success" : "processing";

  useEffect(() => {
    if (name && email && !hasLoggedIn) {
      setHasLoggedIn(true); // Lock it
      const userData = {
        name,
        email,
        ...(tier ? { tier } : {}),
        ...(Number.isFinite(taskLimit) ? { taskLimit } : {}),
      };
      login(userData);
    }
    if (!error && (!name || !email)) {
      navigate("/login");
    }
  }, [login, error, name, email, tier, taskLimit, hasLoggedIn, navigate]);

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => navigate("/login"), 2500);
      return () => clearTimeout(t);
    }

    if (hasLoggedIn) {
      const t = setTimeout(() => navigate("/dashboard"), 1500);
      return () => clearTimeout(t);
    }
  }, [error, hasLoggedIn, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-white/50 text-center max-w-sm w-full"
      >
        {status === "processing" && (
          <div>
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-gray-800">
              Authenticating...
            </h2>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Login Successful!
            </h2>
            <p className="text-gray-500 text-sm">
              Redirecting to your dashboard...
            </p>
          </div>
        )}

        {status === "failed" && (
          <div>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-500 text-sm">
              Redirecting back to login...
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
