import { createSlice } from "@reduxjs/toolkit";

import { getProfile } from "./profile.thunks.js";

// -----------------------------------------------------------------------------
// Initial State
// -----------------------------------------------------------------------------

const initialState = {
  // ---------------------------------------------------------------------------
  // Profile
  // ---------------------------------------------------------------------------

  profile: null,

  // ---------------------------------------------------------------------------
  // Profile Loading
  // ---------------------------------------------------------------------------

  loading: false,

  // ---------------------------------------------------------------------------
  // Profile Error
  // ---------------------------------------------------------------------------

  error: null,
};

// -----------------------------------------------------------------------------
// Profile Slice
// -----------------------------------------------------------------------------

const profileSlice = createSlice({
  name: "profile",

  initialState,

  reducers: {
    // -------------------------------------------------------------------------
    // Clear Profile
    // -------------------------------------------------------------------------

    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },

    // -------------------------------------------------------------------------
    // Clear Profile Error
    // -------------------------------------------------------------------------

    clearProfileError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // =========================================================================
    // Get Profile
    // =========================================================================

    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.profile = action.payload?.data || action.payload || null;
      })

      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch profile.";
      });
  },
});

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

export const { clearProfile, clearProfileError } = profileSlice.actions;

// -----------------------------------------------------------------------------
// Reducer
// -----------------------------------------------------------------------------

export default profileSlice.reducer;
