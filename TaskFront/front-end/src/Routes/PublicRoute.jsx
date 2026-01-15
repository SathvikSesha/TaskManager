import { useAuth } from "../Context/AuthContext";
import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default PublicRoute;
