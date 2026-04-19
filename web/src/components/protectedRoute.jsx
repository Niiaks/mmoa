import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router";
import { Spinner } from "./ui/spinner";
import Loader from "./Loader";

function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
