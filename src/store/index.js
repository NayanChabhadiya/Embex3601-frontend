import { configureStore } from "@reduxjs/toolkit";

import authenticationReducer from "../modules/identity/auth/store/authentication.slice.js";
import userReducer from "../modules/identity/user/store/user.slice.js";
import profileReducer from "../modules/profile/store/profile.slice.js";
import subscriptionPlanReducer from "../modules/platform/subscription-plan/store/subscription-plan.slice.js";
import subscriptionReducer from "../modules/subscription/store/subscription.slice.js";
import featureReducer from "../modules/platform/feature/store/feature.slice.js";
import planFeatureReducer from "../modules/platform/plan-feature/store/plan-feature.slice.js";
import accountReducer from "../modules/account/account/store/account.slice.js";

const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    user: userReducer,
    profile: profileReducer,
    subscriptionPlan: subscriptionPlanReducer,
    subscription: subscriptionReducer,

    feature: featureReducer,
    planFeature: planFeatureReducer,
    account: accountReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: true,
    }),
  devTools: import.meta.env.DEV,
});

export default store;
