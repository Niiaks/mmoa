import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router";

function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
