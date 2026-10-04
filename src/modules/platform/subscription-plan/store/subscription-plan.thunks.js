import { createAsyncThunk } from "@reduxjs/toolkit";

import subscriptionPlanService from "../services/subscription-plan.service.js";

// --------------------------------------------------------------------------
// Create Subscription Plan
// --------------------------------------------------------------------------

export const createSubscriptionPlan = createAsyncThunk(
  "subscriptionPlan/createSubscriptionPlan",
  async (subscriptionPlanData, { rejectWithValue }) => {
    try {
      return await subscriptionPlanService.createSubscriptionPlan(
        subscriptionPlanData,
      );
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
          error?.message ||
          "Failed to create subscription plan.",
      );
    }
  },
);

// --------------------------------------------------------------------------
// Get Subscription Plans - Platform Admin
// --------------------------------------------------------------------------

export const getSubscriptionPlans = createAsyncThunk(
  "subscriptionPlan/getSubscriptionPlans",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await subscriptionPlanService.getSubscriptionPlans(params);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
          error?.message ||
          "Failed to fetch subscription plans.",
      );
    }
  },
);

// --------------------------------------------------------------------------
// Get Available Subscription Plans - Customer
// --------------------------------------------------------------------------

export const getAvailableSubscriptionPlans = createAsyncThunk(
  "subscriptionPlan/getAvailableSubscriptionPlans",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await subscriptionPlanService.getAvailableSubscriptionPlans(
        params,
      );
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
          error?.message ||
          "Failed to fetch available subscription plans.",
      );
    }
  },
);
