import { configureStore } from "@reduxjs/toolkit";

import authenticationReducer from "../modules/auth/store/authentication.slice.js";
import userReducer from "../modules/user/store/user.slice.js";

const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: true,
    }),
  devTools: import.meta.env.DEV,
});

export default store;
