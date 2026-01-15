import { useAuth } from "../Context/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoutes({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null; // or loader

  return user ? children : <Navigate to="/" replace />;
}

export default ProtectedRoutes;
