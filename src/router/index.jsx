import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout.jsx";

import Login from "../modules/auth/pages/login/Login.jsx";
import Dashboard from "../modules/dashboard/pages/dashboard/Dashboard.jsx";

import { NotFound } from "../modules/public/pages/not-found";

import PublicRoutes from "./PublicRoutes.jsx";
import ProtectedRoutes from "./ProtectedRoutes.jsx";
import PlatformAdminRoute from "./PlatformAdminRoute.jsx";

const router = createBrowserRouter([
  // PUBLIC ROUTES
  {
    element: <PublicRoutes />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },

  // AUTHENTICATED ROUTES
  {
    element: <ProtectedRoutes />,
    children: [
      // Common authenticated application routes
      {
        element: <AppLayout />,
        children: [
          {
            path: "/",
            element: <Dashboard />,
          },
        ],
      },

      // Platform Admin routes
      {
        element: <PlatformAdminRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              // Platform Admin routes will be added here.
              // Example:
              // {
              //   path: "/platform-admin",
              //   element: <PlatformAdminDashboard />,
              // },
            ],
          },
        ],
      },
    ],
  },

  // NOT FOUND
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
