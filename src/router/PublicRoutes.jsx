import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function PublicRoutes() {
  const { initialized, isAuthenticated } = useSelector((state) => state.auth);

  if (!initialized) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default PublicRoutes;
