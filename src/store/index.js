import { configureStore } from "@reduxjs/toolkit";

import subscriptionPlanReducer from "../modules/platform-admin/subscription-plans/store/subscription-plan.slice.js";
import featureReducer from "../modules/platform-admin/features/store/feature.slice.js";
import planFeatureReducer from "../modules/platform-admin/plan-features/store/plan-feature.slice.js";
import accountReducer from "../modules/account/store/account.slice.js";
import userReducer from "../modules/user/store/user.slice.js";
import authenticationReducer from "../modules/auth/store/authentication.slice.js";
import workspaceReducer from "../modules/workspace/store/workspace.slice.js";
import workspaceMembershipReducer from "../modules/workspace-membership/store/workspace-membership.slice.js";
import workspaceSubscriptionReducer from "../modules/workspace-subscription/store/workspace-subscription.slice.js";
import unitReducer from "../modules/unit/store/unit.slice.js";
import taxReducer from "../modules/tax/store/tax.slice.js";
import currencyReducer from "../modules/currency/store/currency.slice.js";
import paymentTermReducer from "../modules/payment-term/store/payment-term.slice.js";
import bankReducer from "../modules/bank/store/bank.slice.js";
import hsnSacReducer from "../modules/hsn-sac/store/hsn-sac.slice.js";
import partnerCategoryReducer from "../modules/partner-category/store/partner-category.slice.js";
import productCategoryReducer from "../modules/product-category/store/product-category.slice.js";
import itemReducer from "../modules/item/store/item.slice.js";
import purchaseCompanyReducer from "../modules/purchase-company/store/purchase-company.slice.js";

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
    workspaceSubscription: workspaceSubscriptionReducer,

    unit: unitReducer,
    tax: taxReducer,
    currency: currencyReducer,
    paymentTerm: paymentTermReducer,
    bank: bankReducer,
    hsnSac: hsnSacReducer,
    partnerCategory: partnerCategoryReducer,
    productCategory: productCategoryReducer,
    item: itemReducer,
    purchaseCompany: purchaseCompanyReducer,
  },
});

export default store;
