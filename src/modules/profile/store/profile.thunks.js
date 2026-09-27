import { createAsyncThunk } from "@reduxjs/toolkit";

import profileService from "../services/profile.service.js";

// -----------------------------------------------------------------------------
// Get Current User Profile
// -----------------------------------------------------------------------------

export const getProfile = createAsyncThunk(
  "profile/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await profileService.getProfile();
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error?.message || "Failed to fetch profile.",
      );
    }
  },
);
