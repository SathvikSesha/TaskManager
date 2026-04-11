import { Routes, Route } from "react-router-dom";

import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import AuthStatus from "./Pages/AuthStatus";
import LandingPage from "./Pages/LandingPage";

import ProtectedRoutes from "./Routes/ProtectedRoutes";
import PublicRoute from "./Routes/PublicRoute";

function App() {
  return (
    <Routes>
      {/* LANDING */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />

      {/* LOGIN */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* SIGNUP */}
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />

      <Route path="/auth/status" element={<AuthStatus />} />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoutes>
            <Dashboard />
          </ProtectedRoutes>
        }
      />
    </Routes>
  );
}

export default App;
