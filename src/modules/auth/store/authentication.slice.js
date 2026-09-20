import { createSlice } from "@reduxjs/toolkit";

import { login, getCurrentUser, logout } from "./authentication.thunks.js";

const initialState = {
  user: null,
  session: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

const authenticationSlice = createSlice({
  name: "authentication",

  initialState,

  reducers: {
    clearAuthenticationError: (state) => {
      state.error = null;
    },

    clearAuthentication: (state) => {
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =========================================================
      // Login
      // =========================================================

      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        state.user = action.payload?.user ?? null;
        state.session = action.payload?.session ?? null;

        state.isAuthenticated = Boolean(action.payload?.user);
      })

      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // =========================================================
      // Current User
      // =========================================================

      .addCase(getCurrentUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        state.user = action.payload ?? null;
        state.isAuthenticated = Boolean(action.payload);
      })

      .addCase(getCurrentUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // =========================================================
      // Logout
      // =========================================================

      .addCase(logout.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.session = null;
        state.isAuthenticated = false;
        state.status = "idle";
        state.error = null;
      })

      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearAuthenticationError, clearAuthentication } =
  authenticationSlice.actions;

export default authenticationSlice.reducer;
