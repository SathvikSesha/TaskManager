import { useAuth } from "../Context/AuthContext";
import { Navigate } from "react-router-dom";
function ProtectedRoutes({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}
export default ProtectedRoutes;
