import { configureStore } from "@reduxjs/toolkit";

import subscriptionPlanReducer from "../modules/platform-admin/subscription-plans/store/subscription-plan.slice.js";
import featureReducer from "../modules/platform-admin/features/store/feature.slice.js";
import planFeatureReducer from "../modules/platform-admin/plan-features/store/plan-feature.slice.js";
import accountReducer from "../modules/account/store/account.slice.js";
import userReducer from "../modules/user/store/user.slice.js";
import authenticationReducer from "../modules/auth/store/authentication.slice.js";
import workspaceReducer from "../modules/workspace/store/workspace.slice.js";
import workspaceMembershipReducer from "../modules/workspace-membership/store/workspace-membership.slice.js";

import companyReducer from "../modules/company/store/company.slice.js";
import financialYearReducer from "../modules/financial-year/store/financial-year.slice.js";
import numberSeriesReducer from "../modules/number-series/store/number-series.slice.js";
import branchReducer from "../modules/branch/store/branch.slice.js";
import warehouseReducer from "../modules/warehouse/store/warehouse.slice.js";
import bankAccountReducer from "../modules/bank-account/store/bank-account.slice.js";

import unitReducer from "../modules/unit/store/unit.slice.js";
import taxReducer from "../modules/tax/store/tax.slice.js";
import currencyReducer from "../modules/currency/store/currency.slice.js";
import paymentTermReducer from "../modules/payment-term/store/payment-term.slice.js";
import bankReducer from "../modules/bank/store/bank.slice.js";
import hsnSacReducer from "../modules/hsn-sac/store/hsn-sac.slice.js";
import partnerCategoryReducer from "../modules/partner-category/store/partner-category.slice.js";
import productCategoryReducer from "../modules/product-category/store/product-category.slice.js";

import partnerReducer from "../modules/partner/store/partner.slice.js";
import productReducer from "../modules/product/store/product.slice.js";

import inventoryReducer from "../modules/inventory/store/inventory.slice.js";
import purchaseReducer from "../modules/purchase/store/purchase.slice.js";
import salesReducer from "../modules/sales/store/sales.slice.js";
import jobWorkReducer from "../modules/job-work/store/job-work.slice.js";
import accountingReducer from "../modules/accounting/store/accounting.slice.js";

const store = configureStore({
  reducer: {
    subscriptionPlan: subscriptionPlanReducer,
    feature: featureReducer,
    planFeature: planFeatureReducer,
    account: accountReducer,
    user: userReducer,
    authentication: authenticationReducer,
    workspace: workspaceReducer,
    workspaceMembership: workspaceMembershipReducer,

    company: companyReducer,
    financialYear: financialYearReducer,
    numberSeries: numberSeriesReducer,
    branch: branchReducer,
    warehouse: warehouseReducer,
    bankAccount: bankAccountReducer,

    unit: unitReducer,
    tax: taxReducer,
    currency: currencyReducer,
    paymentTerm: paymentTermReducer,
    bank: bankReducer,
    hsnSac: hsnSacReducer,
    partnerCategory: partnerCategoryReducer,
    productCategory: productCategoryReducer,

    partner: partnerReducer,
    product: productReducer,

    inventory: inventoryReducer,
    purchase: purchaseReducer,
    sales: salesReducer,
    jobWork: jobWorkReducer,
    accounting: accountingReducer,
  },
});

export default store;
