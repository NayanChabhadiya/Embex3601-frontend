import { createBrowserRouter } from "react-router-dom";

import { NotFound } from "../modules/public/pages/not-found";
import Dashboard from "../modules/dashboard/pages/dashboard/Dashboard.jsx";

import AppLayout from "../components/layout/AppLayout";
import SubscriptionPlanPage from "../modules/platform-admin/subscription-plans/SubscriptionPlanPage";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/platform-admin/subscription-plans",
        element: <SubscriptionPlanPage />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
