import { Navigate, Outlet, useLocation } from "react-router-dom";

import { APP_ROUTES } from "../../constant";

const ProtectedRoute = ({ isAuthenticated = false }) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={APP_ROUTES.PUBLIC.LOGIN}
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
