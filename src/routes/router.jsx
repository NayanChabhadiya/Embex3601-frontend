import { createBrowserRouter } from "react-router-dom";
import PageNotFound from "./pageNotFound/pageNotFound";
import MainLayout from "../layouts/mainLayout";
import Login from "./auth/login";
import Register from "./auth/register";
import ForgotPassword from "./auth/forgotPassword";
import VerifyEmail from "./auth/verifyEmail";
import PublicRoutes from "./publicRoutes";
import ProtectedRoutes from "./protectedRoutes";
import User from "./admin/user/user";
import Dashboard from "./admin/dashboard/dashboard";
import ResetPassword from "./auth/resetPassword";
import SubscriptionPlan from "./admin/subscriptionPlan/subscriptionPlans";
import Item from "./user/item/item";
import SupplierCategories from "./user/supplier/supplierCategories";
import Supplier from "./user/supplier/supplier";
import PurchaseCompanies from "./user/item/purchaseCompanies";
import PurchasedItem from "./user/item/purchasedItem";
import Company from "./user/company/company";
import Merchant from "./user/merchant/merchant";
import Bill from "./user/bill/bill";
import CbmCalculator from "./user/calculator/cbmCalculator";
import Home from "./user/home/home";
import SinglePurchaseCompany from "./user/item/singlePurchaseCompany";
import PayToPurchaseCompany from "./user/item/payToPurchaseCompany";
import SingleMerchant from "./user/merchant/singleMerchant";
import MerchantReceivedAmount from "./user/merchant/merchantReceivedAmount";
import Buyer from "./user/buyer/buyer";
import Selling from "./user/selling/selling";
import Worker from "./user/worker/worker";
import SingleWorker from "./user/worker/singleWorker";
import Machine from "./user/machine/machine";
import SingleMachine from "./user/machine/singleMachine";

const router = createBrowserRouter([
  {
    path: "*",
    element: <PageNotFound />,
  },
  {
    path: "/login",
    element: (
      <PublicRoutes>
        <Login />
      </PublicRoutes>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoutes>
        <Register />
      </PublicRoutes>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <PublicRoutes>
        <ForgotPassword />
      </PublicRoutes>
    ),
  },
  {
    path: "/verification",
    element: (
      <PublicRoutes>
        <VerifyEmail />
      </PublicRoutes>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <PublicRoutes>
        <ResetPassword />
      </PublicRoutes>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <Dashboard />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/user",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <User />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/subscription-plans",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <SubscriptionPlan />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/items",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <Item />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/purchase-companies",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <PurchaseCompanies />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/single-purchase-company/:name",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <SinglePurchaseCompany />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/pay-to-purchase-company/:name",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <PayToPurchaseCompany />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/purchased-items",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <PurchasedItem />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/companies",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <Company />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/workers",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <Worker />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/single-worker/:name",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <SingleWorker />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/machine",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <Machine />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/single-machine/:machineNo",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <SingleMachine />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/buyers",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <Buyer />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/sellings",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <Selling />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/merchants",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <Merchant />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/single-merchant/:name",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <SingleMerchant />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/merchant-received-amount/:name",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <MerchantReceivedAmount />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/bills",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <Bill />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/supplier-categories",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <SupplierCategories />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/supplier",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <Supplier />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/cbm-calculator",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <CbmCalculator />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  {
    path: "/home",
    element: (
      <ProtectedRoutes>
        <MainLayout>
          <Home />
        </MainLayout>
      </ProtectedRoutes>
    ),
  },
  
]);

export default router;
