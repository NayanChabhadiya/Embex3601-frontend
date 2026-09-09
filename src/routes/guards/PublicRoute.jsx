import { Navigate, Outlet } from "react-router-dom";

import { APP_ROUTES } from "../../constant";

const PublicRoute = ({ isAuthenticated = false }) => {
  if (isAuthenticated) {
    return <Navigate to={APP_ROUTES.PROTECTED.DASHBOARD} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
