// =============================================================================
// Feature Thunks
// =============================================================================

import { createAsyncThunk } from "@reduxjs/toolkit";

import featureService from "../services/feature.service.js";

// =============================================================================
// Create Feature
// =============================================================================

export const createFeature = createAsyncThunk(
  "feature/createFeature",
  async (featureData, { rejectWithValue }) => {
    try {
      return await featureService.createFeature(featureData);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error?.message || "Failed to create feature.",
      );
    }
  },
);

// =============================================================================
// Get Features
// =============================================================================

export const getFeatures = createAsyncThunk(
  "feature/getFeatures",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await featureService.getFeatures(params);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error?.message || "Failed to fetch features.",
      );
    }
  },
);
