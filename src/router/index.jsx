import { createBrowserRouter } from "react-router-dom";

import { NotFound } from "../modules/public/pages/not-found";
import Dashboard from "../modules/dashboard/pages/dashboard/Dashboard.jsx";

import AppLayout from "../components/layout/AppLayout";
import SubscriptionPlanPage from "../modules/platform-admin/subscription-plans/SubscriptionPlanPage";
import FeaturePage from "../modules/platform-admin/features/FeaturePage.jsx";
import PlanFeaturePage from "../modules/platform-admin/plan-features/PlanFeaturePage.jsx";
import AccountPage from "../modules/account/AccountPage.jsx";
import UserPage from "../modules/user/UserPage.jsx";
import Login from "../modules/auth/pages/login/Login.jsx";
import WorkspacePage from "../modules/workspace/WorkspacePage.jsx";
import WorkspaceMembershipPage from "../modules/workspace-membership/WorkspaceMembershipPage.jsx";
import WorkspaceSubscriptionPage from "../modules/workspace-subscription/WorkspaceSubscriptionPage.jsx";
import UnitPage from "../modules/unit/UnitPage.jsx";
import TaxPage from "../modules/tax/TaxPage.jsx";
import CurrencyPage from "../modules/currency/CurrencyPage.jsx";
import PaymentTermPage from "../modules/payment-term/PaymentTermPage.jsx";
import BankPage from "../modules/bank/BankPage.jsx";
import HsnSacPage from "../modules/hsn-sac/HsnSacPage.jsx";

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
      {
        path: "/platform-admin/features",
        element: <FeaturePage />,
      },
      {
        path: "/platform-admin/plan-features",
        element: <PlanFeaturePage />,
      },
      {
        path: "/accounts",
        element: <AccountPage />,
      },
      {
        path: "/users",
        element: <UserPage />,
      },
      {
        path: "/workspaces",
        element: <WorkspacePage />,
      },
      {
        path: "/workspace-memberships",
        element: <WorkspaceMembershipPage />,
      },
      {
        path: "/workspace-subscriptions",
        element: <WorkspaceSubscriptionPage />,
      },
      {
        path: "/units",
        element: <UnitPage />,
      },
      {
        path: "/taxes",
        element: <TaxPage />,
      },
      {
        path: "/currencies",
        element: <CurrencyPage />,
      },
      {
        path: "/payment-terms",
        element: <PaymentTermPage />,
      },
      {
        path: "/banks",
        element: <BankPage />,
      },
      {
        path: "/hsn-sac",
        element: <HsnSacPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
