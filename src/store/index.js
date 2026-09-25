import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "../modules/auth/store/authentication.slice.js";

const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
  },
});

export default store;
