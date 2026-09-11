import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  initialized: false,

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
    initializeAuth(state, action) {
      const authenticated = action.payload?.isAuthenticated === true;

      state.initialized = true;
      state.isAuthenticated = authenticated;

      state.status = authenticated ? "authenticated" : "unauthenticated";

      state.accessToken = action.payload?.accessToken ?? null;

      state.user = action.payload?.user ?? null;

      state.workspace = action.payload?.workspace ?? null;

      state.company = action.payload?.company ?? null;

      state.permissions = Array.isArray(action.payload?.permissions)
        ? action.payload.permissions
        : [];

      state.error = null;
    },

    loginSuccess(state, action) {
      state.initialized = true;
      state.isAuthenticated = true;
      state.status = "authenticated";

      state.accessToken = action.payload?.accessToken ?? null;

      state.user = action.payload?.user ?? action.payload?.account ?? null;

      state.workspace = action.payload?.workspace ?? null;

      state.company = action.payload?.company ?? null;

      state.permissions = Array.isArray(action.payload?.permissions)
        ? action.payload.permissions
        : [];

      state.error = null;
    },

    updateAccessToken(state, action) {
      const accessToken = action.payload?.accessToken ?? null;

      state.accessToken = accessToken;

      if (accessToken) {
        state.initialized = true;
        state.isAuthenticated = true;
        state.status = "authenticated";
        state.error = null;
      }
    },

    setLoading(state) {
      state.status = "loading";
      state.error = null;
    },

    authFailure(state, action) {
      state.initialized = true;
      state.isAuthenticated = false;
      state.status = "error";

      state.accessToken = null;
      state.user = null;
      state.workspace = null;
      state.company = null;
      state.permissions = [];

      state.error = action.payload ?? "Authentication failed.";
    },

    clearAuthError(state) {
      state.error = null;
    },

    logoutSuccess(state) {
      state.initialized = true;
      state.status = "unauthenticated";

      state.isAuthenticated = false;
      state.accessToken = null;

      state.user = null;
      state.workspace = null;
      state.company = null;
      state.permissions = [];

      state.error = null;
    },
  },
});

export const {
  initializeAuth,
  loginSuccess,
  updateAccessToken,
  setLoading,
  authFailure,
  clearAuthError,
  logoutSuccess,
} = authSlice.actions;

export default authSlice.reducer;
