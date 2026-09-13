import { createBrowserRouter } from "react-router-dom";

import { LoginPage } from "../modules/auth/pages";
import { NotFound } from "../modules/public/pages/not-found";
import { Dashboard } from "../modules/dashboard/pages/dashboard";

import AppLayout from "../components/layout/AppLayout";

import PublicRoutes from "./PublicRoutes";
import ProtectedRoutes from "./ProtectedRoutes";

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
