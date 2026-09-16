import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../modules/auth/store/auth.slice.js";
import featureReducer from "../modules/platform-admin/features/store/feature.slice.js";
import planFeatureReducer from "../modules/platform-admin/subscription-plans/store/plan-feature.slice.js";
import platformAdminReducer from "../modules/platform-admin/store/platform-admin.slice.js";
import subscriptionPlanReducer from "../modules/platform-admin/subscription-plans/store/subscription-plan.slice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    features: featureReducer,
    planFeatures: planFeatureReducer,
    platformAdmin: platformAdminReducer,
    subscriptionPlans: subscriptionPlanReducer,
  },
});

export default store;
