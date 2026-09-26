import { createSlice } from "@reduxjs/toolkit";

import {
  login,
  refresh,
  getCurrentUser,
  logout,
} from "./authentication.thunks.js";

import AUTHENTICATION_CONSTANTS from "../constants/authentication.constants.js";

// -----------------------------------------------------------------------------
// Stored User
// -----------------------------------------------------------------------------

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem(
      AUTHENTICATION_CONSTANTS.STORAGE_KEYS.USER,
    );

    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

// -----------------------------------------------------------------------------
// Initial State
// -----------------------------------------------------------------------------

const storedUser = getStoredUser();

const initialState = {
  user: storedUser,

  isAuthenticated: Boolean(storedUser),

  status: AUTHENTICATION_CONSTANTS.AUTHENTICATION_STATUS.IDLE,

  error: null,
};

// -----------------------------------------------------------------------------
// Slice
// -----------------------------------------------------------------------------

const authenticationSlice = createSlice({
  name: "authentication",

  initialState,

  reducers: {
    // -------------------------------------------------------------------------
    // Clear Authentication Error
    // -------------------------------------------------------------------------

    clearAuthenticationError: (state) => {
      state.error = null;
    },

    // -------------------------------------------------------------------------
    // Clear Authentication
    // -------------------------------------------------------------------------

    clearAuthentication: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = AUTHENTICATION_CONSTANTS.AUTHENTICATION_STATUS.IDLE;
      state.error = null;

      localStorage.removeItem(
        AUTHENTICATION_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN,
      );

      localStorage.removeItem(
        AUTHENTICATION_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN,
      );
      localStorage.removeItem(AUTHENTICATION_CONSTANTS.STORAGE_KEYS.SESSION_ID);
      localStorage.removeItem(AUTHENTICATION_CONSTANTS.STORAGE_KEYS.USER);
    },
  },

  extraReducers: (builder) => {
    builder

      // -----------------------------------------------------------------------
      // Login
      // -----------------------------------------------------------------------

      .addCase(login.pending, (state) => {
        state.status = AUTHENTICATION_CONSTANTS.AUTHENTICATION_STATUS.LOADING;

        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.status = AUTHENTICATION_CONSTANTS.AUTHENTICATION_STATUS.SUCCEEDED;

        state.error = null;

        state.user = action.payload?.user ?? null;

        state.isAuthenticated = Boolean(action.payload?.user);
      })

      .addCase(login.rejected, (state, action) => {
        state.status = AUTHENTICATION_CONSTANTS.AUTHENTICATION_STATUS.FAILED;

        state.error = action.payload || null;

        state.isAuthenticated = false;

        state.user = null;
      })

      // -----------------------------------------------------------------------
      // Refresh
      // -----------------------------------------------------------------------

      .addCase(refresh.pending, (state) => {
        state.error = null;
      })

      .addCase(refresh.fulfilled, (state, action) => {
        state.error = null;

        if (action.payload?.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      })

      .addCase(refresh.rejected, (state, action) => {
        state.error = action.payload || null;

        state.user = null;

        state.isAuthenticated = false;

        state.status = AUTHENTICATION_CONSTANTS.AUTHENTICATION_STATUS.FAILED;
      })

      // -----------------------------------------------------------------------
      // Current User
      // -----------------------------------------------------------------------

      .addCase(getCurrentUser.pending, (state) => {
        state.status = AUTHENTICATION_CONSTANTS.AUTHENTICATION_STATUS.LOADING;

        state.error = null;
      })

      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.status = AUTHENTICATION_CONSTANTS.AUTHENTICATION_STATUS.SUCCEEDED;

        state.error = null;

        state.user = action.payload ?? null;

        state.isAuthenticated = Boolean(action.payload);
      })

      .addCase(getCurrentUser.rejected, (state, action) => {
        state.status = AUTHENTICATION_CONSTANTS.AUTHENTICATION_STATUS.FAILED;

        state.error = action.payload || null;

        state.user = null;

        state.isAuthenticated = false;
      })

      // -----------------------------------------------------------------------
      // Logout
      // -----------------------------------------------------------------------

      .addCase(logout.pending, (state) => {
        state.status = AUTHENTICATION_CONSTANTS.AUTHENTICATION_STATUS.LOADING;

        state.error = null;
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;

        state.isAuthenticated = false;

        state.status = AUTHENTICATION_CONSTANTS.AUTHENTICATION_STATUS.IDLE;

        state.error = null;
      })

      .addCase(logout.rejected, (state, action) => {
        state.status = AUTHENTICATION_CONSTANTS.AUTHENTICATION_STATUS.FAILED;

        state.error = action.payload || null;
      });
  },
});

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

export const { clearAuthenticationError, clearAuthentication } =
  authenticationSlice.actions;

// -----------------------------------------------------------------------------
// Reducer
// -----------------------------------------------------------------------------

export default authenticationSlice.reducer;
