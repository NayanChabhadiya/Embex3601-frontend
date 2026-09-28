import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout.jsx";

import Login from "../modules/auth/pages/login/Login.jsx";
import Dashboard from "../modules/dashboard/pages/dashboard/Dashboard.jsx";

import { NotFound } from "../modules/public/pages/not-found";

import PublicRoutes from "./PublicRoutes.jsx";
import ProtectedRoutes from "./ProtectedRoutes.jsx";
import PlatformAdminRoute from "./PlatformAdminRoute.jsx";
import UserPage from "../modules/user/UserPage.jsx";
import ProfilePage from "../modules/profile/ProfilePage.jsx";
import AccountPage from "../modules/account/AccountPage.jsx";

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
          // -------------------------------------------------------------------
          // Profile
          // -------------------------------------------------------------------
          {
            path: "/profile",
            element: <ProfilePage />,
          },

          {
            path: "/accounts",
            element: <AccountPage />,
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
              {
                path: "/users",
                element: <UserPage />,
              },
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
