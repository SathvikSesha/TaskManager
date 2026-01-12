import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Pages/DashBoard";
import ProtectedRoutes from "./Routes/ProtectedRoutes";
import Login from "./Pages/Login";
import LandingPage from "./Pages/LandingPage";
import SignUp from "./Pages/SignUp";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

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
