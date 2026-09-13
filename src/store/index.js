import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../modules/auth/store/auth.slice.js";
import platformAdminReducer from "../modules/platform-admin/store/platform-admin.slice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    platformAdmin: platformAdminReducer,
  },
});

export default store;
