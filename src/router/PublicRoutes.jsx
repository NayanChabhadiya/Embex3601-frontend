import { Navigate, Outlet, useLocation } from "react-router-dom";

import useAuthentication from "../modules/auth/hooks/useAuthentication.js";

function PublicRoutes() {
  const location = useLocation();

  const { isAuthenticated, isLoading } = useAuthentication();

  // Authentication state is still being resolved.
  // Do not redirect before authentication status is known.
  if (isLoading) {
    return null;
  }

  // Already authenticated
  if (isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || "/";

    return <Navigate to={redirectTo} replace />;
  }

  // Not authenticated
  // Allow public route
  return <Outlet />;
}

export default PublicRoutes;
