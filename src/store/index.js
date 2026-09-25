import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "../modules/auth/store/authentication.slice.js";

const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: true,
    }),

  devTools: import.meta.env.DEV,
});

export default store;
