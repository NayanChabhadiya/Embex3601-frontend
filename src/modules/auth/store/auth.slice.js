import { createSlice } from "@reduxjs/toolkit";
import { login, refreshSession } from "./auth.thunks";

const initialState = {
  status: "idle",
  isInitializing: true,
  isAuthenticated: false,

  accessToken: null,

  user: null,
  workspace: null,
  company: null,
  permissions: [],

  error: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    clearAuth(state) {
      state.status = "idle";
      state.isAuthenticated = false;
      state.accessToken = null;
      state.user = null;
      state.workspace = null;
      state.company = null;
      state.permissions = [];
      state.error = null;
    },

    clearAuthError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;

        state.accessToken = action.payload.accessToken;

        state.user = action.payload.user || null;
        state.workspace = action.payload.workspace || null;
        state.company = action.payload.company || null;
        state.permissions = action.payload.permissions || [];

        state.error = null;
      })

      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.isAuthenticated = false;
        state.accessToken = null;
        state.error = action.payload || "Unable to sign in. Please try again.";
      })

      .addCase(refreshSession.pending, (state) => {
        state.isInitializing = true;
        state.error = null;
      })

      .addCase(refreshSession.fulfilled, (state, action) => {
        state.isInitializing = false;
        state.status = "succeeded";
        state.isAuthenticated = true;

        state.accessToken = action.payload.accessToken;

        state.user = action.payload.user || null;
        state.workspace = action.payload.workspace || null;
        state.company = action.payload.company || null;
        state.permissions = action.payload.permissions || [];

        state.error = null;
      })

      .addCase(refreshSession.rejected, (state) => {
        state.isInitializing = false;
        state.status = "idle";
        state.isAuthenticated = false;
        state.accessToken = null;

        state.user = null;
        state.workspace = null;
        state.company = null;
        state.permissions = [];

        state.error = null;
      });
  },
});

export const { clearAuth, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
