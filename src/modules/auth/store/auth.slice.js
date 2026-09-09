import { createSlice } from "@reduxjs/toolkit";

import { AUTH_STATUS } from "../constants/auth.constants";

const initialState = Object.freeze({
  status: AUTH_STATUS.IDLE,
  isAuthenticated: false,
  user: null,
  error: null,
});

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    clearAuthState: () => initialState,

    clearAuthError: (state) => {
      state.error = null;
    },

    setAuthenticated: (state, action) => {
      state.status = AUTH_STATUS.AUTHENTICATED;
      state.isAuthenticated = true;
      state.user = action.payload ?? null;
      state.error = null;
    },

    setUnauthenticated: (state) => {
      state.status = AUTH_STATUS.UNAUTHENTICATED;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase("auth/login/pending", (state) => {
        state.status = AUTH_STATUS.LOADING;
        state.error = null;
      })
      .addCase("auth/login/fulfilled", (state, action) => {
        state.status = AUTH_STATUS.AUTHENTICATED;
        state.isAuthenticated = true;
        state.user = action.payload ?? null;
        state.error = null;
      })
      .addCase("auth/login/rejected", (state, action) => {
        state.status = AUTH_STATUS.FAILED;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload ?? action.error?.message ?? null;
      })
      .addCase("auth/logout/fulfilled", (state) => {
        state.status = AUTH_STATUS.UNAUTHENTICATED;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase("auth/refreshToken/fulfilled", (state, action) => {
        state.status = AUTH_STATUS.AUTHENTICATED;
        state.isAuthenticated = true;
        state.user = action.payload ?? state.user;
        state.error = null;
      })
      .addCase("auth/refreshToken/rejected", (state) => {
        state.status = AUTH_STATUS.UNAUTHENTICATED;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase("auth/getCurrentUser/pending", (state) => {
        state.status = AUTH_STATUS.LOADING;
        state.error = null;
      })
      .addCase("auth/getCurrentUser/fulfilled", (state, action) => {
        state.status = AUTH_STATUS.AUTHENTICATED;
        state.isAuthenticated = true;
        state.user = action.payload ?? null;
        state.error = null;
      })
      .addCase("auth/getCurrentUser/rejected", (state, action) => {
        state.status = AUTH_STATUS.UNAUTHENTICATED;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload ?? null;
      });
  },
});

export const {
  clearAuthState,
  clearAuthError,
  setAuthenticated,
  setUnauthenticated,
} = authSlice.actions;

export default authSlice.reducer;
