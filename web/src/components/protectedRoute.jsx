import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router";
import Loader from "./Loader";

function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loader />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
