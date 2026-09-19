import { configureStore } from "@reduxjs/toolkit";

import subscriptionPlanReducer from "../modules/platform-admin/subscription-plans/store/subscription-plan.slice.js";
import featureReducer from "../modules/platform-admin/features/store/feature.slice.js";
import planFeatureReducer from "../modules/platform-admin/plan-features/store/plan-feature.slice.js";

const store = configureStore({
  reducer: {
    subscriptionPlan: subscriptionPlanReducer,
    feature: featureReducer,
    planFeature: planFeatureReducer,
  },
});

export default store;
