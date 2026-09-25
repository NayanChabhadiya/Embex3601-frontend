import { Navigate, Outlet, useLocation } from "react-router-dom";

import useAuthentication from "../modules/auth/hooks/useAuthentication.js";
import AUTHENTICATION_CONSTANTS from "../modules/auth/constants/authentication.constants.js";

function PlatformAdminRoute() {
  const location = useLocation();

  const { user, isAuthenticated, isLoading } = useAuthentication();

  // Authentication is still being resolved.
  if (isLoading) {
    return null;
  }

  // User is not authenticated.
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  // Platform Admin Authorization
  if (user.type !== AUTHENTICATION_CONSTANTS.USER_TYPES.PLATFORM_ADMIN) {
    return <Navigate to="/" replace />;
  }

  // Authorized Platform Admin
  return <Outlet />;
}

export default PlatformAdminRoute;
