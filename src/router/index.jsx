import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout.jsx";

import Register from "../modules/identity/auth/pages/register/Register.jsx";
import VerifyEmail from "../modules/identity/auth/pages/verify-email/VerifyEmail.jsx";
import Login from "../modules/identity/auth/pages/login/Login.jsx";

import { NotFound } from "../modules/public/pages/not-found";

import PublicRoutes from "./PublicRoutes.jsx";
import ProtectedRoutes from "./ProtectedRoutes.jsx";
import PlatformAdminRoute from "./PlatformAdminRoute.jsx";
import Dashboard from "../dashboard/customer/Dashboard.jsx";
import ProfilePage from "../modules/profile/ProfilePage.jsx";
import UserPage from "../modules/identity/user/UserPage.jsx";
import SubscriptionPlanPage from "../modules/platform/subscription-plan/SubscriptionPlanPage.jsx";
import CustomerSubscriptionPlansPage from "../modules/subscription/CustomerSubscriptionPlansPage.jsx";
import SubscriptionCheckoutPage from "../modules/subscription/SubscriptionCheckoutPage.jsx";

import FeaturePage from "../modules/platform/feature/FeaturePage.jsx";
import PlanFeaturePage from "../modules/platform/plan-feature/PlanFeaturePage.jsx";

const router = createBrowserRouter([
  // PUBLIC ROUTES
  {
    element: <PublicRoutes />,
    children: [
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/verify-email",
        element: <VerifyEmail />,
      },
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
          // -----------------------------------------------------------------
          // Customer Subscription Plans
          // -----------------------------------------------------------------
          {
            path: "/subscription",
            element: <CustomerSubscriptionPlansPage />,
          },
          {
            path: "/subscription/:planId",
            element: <SubscriptionCheckoutPage />,
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
              // Subscription Plans
              {
                path: "/subscription-plans",
                element: <SubscriptionPlanPage />,
              },
              // Features
              {
                path: "/features",
                element: <FeaturePage />,
              },
              // Plan Features
              {
                path: "/plan-features",
                element: <PlanFeaturePage />,
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
