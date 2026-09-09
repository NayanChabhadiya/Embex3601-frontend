import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../modules/auth/store/auth.slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: true,
      serializableCheck: true,
    }),

  devTools: import.meta.env.DEV,
});

export default store;
