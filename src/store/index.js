import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../modules/auth/store/auth.slice.js";
import platformAdminReducer from "../modules/platform-admin/store/platform-admin.slice.js";
import subscriptionPlanReducer from "../modules/platform-admin/subscription-plans/store/subscription-plan.slice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    platformAdmin: platformAdminReducer,
    subscriptionPlans: subscriptionPlanReducer,
  },
});

export default store;
