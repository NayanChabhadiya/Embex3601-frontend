import { configureStore } from "@reduxjs/toolkit";

import subscriptionPlanReducer from "../modules/platform-admin/subscription-plans/store/subscription-plan.slice.js";
import featureReducer from "../modules/platform-admin/features/store/feature.slice.js";
import planFeatureReducer from "../modules/platform-admin/plan-features/store/plan-feature.slice.js";
import accountReducer from "../modules/account/store/account.slice.js";
import userReducer from "../modules/user/store/user.slice.js";
import authenticationReducer from "../modules/auth/store/authentication.slice.js";
import workspaceReducer from "../modules/workspace/store/workspace.slice.js";

const store = configureStore({
  reducer: {
    subscriptionPlan: subscriptionPlanReducer,
    feature: featureReducer,
    planFeature: planFeatureReducer,
    account: accountReducer,
    user: userReducer,
    authentication: authenticationReducer,
    workspace: workspaceReducer,
  },
});

export default store;
