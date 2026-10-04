import { createAsyncThunk } from "@reduxjs/toolkit";

import subscriptionService from "../services/subscription.service.js";

// --------------------------------------------------------------------------
// Create Subscription
// --------------------------------------------------------------------------

export const createSubscription = createAsyncThunk(
  "subscription/createSubscription",
  async (subscriptionData, { rejectWithValue }) => {
    try {
      return await subscriptionService.createSubscription(subscriptionData);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
          error?.message ||
          "Failed to create subscription.",
      );
    }
  },
);

// --------------------------------------------------------------------------
// Get Active Subscription
// --------------------------------------------------------------------------

export const getActiveSubscription = createAsyncThunk(
  "subscription/getActiveSubscription",
  async (_, { rejectWithValue }) => {
    try {
      return await subscriptionService.getActiveSubscription();
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
          error?.message ||
          "Failed to fetch active subscription.",
      );
    }
  },
);
