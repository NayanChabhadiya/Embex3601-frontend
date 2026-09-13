import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectIsAuthenticated } from "../modules/auth/store/auth.selectors.js";
import {
  selectIsPlatformAdmin,
  selectIsPlatformAdminLoading,
} from "../modules/platform-admin/store/platform-admin.selectors.js";

const PlatformAdminRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isPlatformAdmin = useSelector(selectIsPlatformAdmin);
  const isLoading = useSelector(selectIsPlatformAdminLoading);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return null;
  }

  if (!isPlatformAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PlatformAdminRoute;
