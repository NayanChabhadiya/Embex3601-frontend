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
import UnitPage from "../modules/unit/UnitPage.jsx";
import TaxPage from "../modules/tax/TaxPage.jsx";
import CurrencyPage from "../modules/currency/CurrencyPage.jsx";
import PaymentTermPage from "../modules/payment-term/PaymentTermPage.jsx";
import BankPage from "../modules/bank/BankPage.jsx";
import HsnSacPage from "../modules/hsn-sac/HsnSacPage.jsx";
import PartnerCategoryPage from "../modules/partner-category/PartnerCategoryPage.jsx";
import ProductCategoryPage from "../modules/product-category/ProductCategoryPage.jsx";
import CompanyPage from "../modules/company/CompanyPage.jsx";
import FinancialYear from "../modules/financial-year/FinancialYear.jsx";
import NumberSeries from "../modules/number-series/NumberSeries.jsx";
import Branch from "../modules/branch/Branch.jsx";
import WarehousePage from "../modules/warehouse/Warehouse.jsx";
import BankAccount from "../modules/bank-account/BankAccount.jsx";
import PartnerPage from "../modules/partner/PartnerPage.jsx";
import ProductPage from "../modules/product/ProductPage.jsx";

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
        path: "/companies",
        element: <CompanyPage />,
      },
      {
        path: "/financial-years",
        element: <FinancialYear />,
      },
      {
        path: "/number-series",
        element: <NumberSeries />,
      },
      {
        path: "/branches",
        element: <Branch />,
      },
      {
        path: "/warehouses",
        element: <WarehousePage />,
      },
      {
        path: "/bank-accounts",
        element: <BankAccount />,
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
      {
        path: "/partner-categories",
        element: <PartnerCategoryPage />,
      },
      {
        path: "/product-categories",
        element: <ProductCategoryPage />,
      },
      {
        path: "/partners",
        element: <PartnerPage />,
      },
      {
        path: "/products",
        element: <ProductPage />,
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
