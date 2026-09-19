import { configureStore } from "@reduxjs/toolkit";

import subscriptionPlanReducer from "../modules/platform-admin/subscription-plans/store/subscription-plan.slice.js";

const store = configureStore({
  reducer: {
    subscriptionPlan: subscriptionPlanReducer,
  },
});

export default store;