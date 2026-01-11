import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Pages/DashBoard";
import ProtectedRoutes from "./Routes/ProtectedRoutes";
import Login from "./Pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />

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
