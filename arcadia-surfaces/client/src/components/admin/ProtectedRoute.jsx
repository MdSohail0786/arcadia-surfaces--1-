import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../common/Loader";

export default function ProtectedRoute({ children }) {
  const { user, checking } = useAuth();

  if (checking) return <Loader label="Checking session" />;
  if (!user) return <Navigate to="/admin/login" replace />;

  return children;
}
