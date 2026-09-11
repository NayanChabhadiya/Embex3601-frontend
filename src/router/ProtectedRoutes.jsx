import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoutes({ children }) {
  const { initialized, isAuthenticated } = useSelector((state) => state.auth);

  if (!initialized) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoutes;
