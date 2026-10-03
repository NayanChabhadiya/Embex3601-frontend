// =============================================================================
// Plan Feature Thunks
// =============================================================================

import { createAsyncThunk } from "@reduxjs/toolkit";

import planFeatureService from "../services/plan-feature.service.js";

// =============================================================================
// Create Plan Feature
// =============================================================================

export const createPlanFeature = createAsyncThunk(
  "planFeature/createPlanFeature",
  async (data, { rejectWithValue }) => {
    try {
      const response = await planFeatureService.createPlanFeature(data);

      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
          error?.message ||
          "Failed to create plan feature.",
      );
    }
  },
);

// =============================================================================
// Get Plan Features
// =============================================================================

export const getPlanFeatures = createAsyncThunk(
  "planFeature/getPlanFeatures",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await planFeatureService.getPlanFeatures(params);

      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
          error?.message ||
          "Failed to fetch plan features.",
      );
    }
  },
);
