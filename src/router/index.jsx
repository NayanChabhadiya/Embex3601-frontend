import { createBrowserRouter } from "react-router-dom";

import { LoginPage } from "../modules/auth/pages";
import { NotFound } from "../modules/public/pages/not-found";
import { Dashboard } from "../modules/dashboard/pages/dashboard";

import AppLayout from "../components/layout/AppLayout";

import PublicRoutes from "./PublicRoutes";
import ProtectedRoutes from "./ProtectedRoutes";
import PlatformAdminRoute from "./PlatformAdminRoute";
import PlatformAdminDashboard from "../modules/platform-admin/pages/dashboard/PlatformAdminDashboard";
import SubscriptionPlanDetailsPage from "../modules/platform-admin/subscription-plans/pages/details/SubscriptionPlanDetailsPage";
import SubscriptionPlanEditPage from "../modules/platform-admin/subscription-plans/pages/edit/SubscriptionPlanEditPage";
import SubscriptionPlanPage from "../modules/platform-admin/subscription-plans/SubscriptionPlanPage";

const router = createBrowserRouter([
  {
    element: <PublicRoutes />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },

  {
    element: <ProtectedRoutes />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/",
            element: <Dashboard />,
          },

          {
            element: <PlatformAdminRoute />,
            children: [
              {
                path: "/platform-admin",
                element: <PlatformAdminDashboard />,
              },
              {
                path: "/platform-admin/subscription-plans",
                element: <SubscriptionPlanPage />,
              },
              {
                path: "/platform-admin/subscription-plans/:id",
                element: <SubscriptionPlanDetailsPage />,
              },
              {
                path: "/platform-admin/subscription-plans/:id/edit",
                element: <SubscriptionPlanEditPage />,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
