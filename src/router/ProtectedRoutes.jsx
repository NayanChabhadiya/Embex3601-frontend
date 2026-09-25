import { Navigate, Outlet, useLocation } from "react-router-dom";

import useAuthentication from "../modules/auth/hooks/useAuthentication.js";

function ProtectedRoutes() {
  const location = useLocation();

  const { isAuthenticated, isLoading } = useAuthentication();

  // Authentication state is still being resolved.
  // Do not redirect prematurely.
  if (isLoading) {
    return null;
  }

  // User is not authenticated.
  if (!isAuthenticated) {
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

  // User is authenticated.
  return <Outlet />;
}

export default ProtectedRoutes;
