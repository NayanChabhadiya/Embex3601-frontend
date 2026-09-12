import { createBrowserRouter } from "react-router-dom";

import { LoginPage } from "../modules/auth/pages";
import PublicRoutes from "./PublicRoutes";
import { NotFound } from "../modules/public/pages/not-found";
import ProtectedRoutes from "./ProtectedRoutes";
import { Dashboard } from "../modules/dashboard/pages/dashboard";
import AppLayout from "../components/layout/AppLayout";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoutes>
        <LoginPage />
      </PublicRoutes>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <AppLayout>
          <Dashboard />
        </AppLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
