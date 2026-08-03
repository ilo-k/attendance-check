import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function ProtectedRoute({ children }) {
  const { token, user } = useAuth();
  const location = useLocation();

  if (!token) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  if (!user?.nickname && location.pathname !== "/nickname") {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/nickname?redirect=${redirect}`} replace />;
  }

  return children;
}
