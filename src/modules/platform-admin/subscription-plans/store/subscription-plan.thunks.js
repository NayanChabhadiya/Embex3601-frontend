import { createAsyncThunk } from "@reduxjs/toolkit";

import subscriptionPlanService from "../services/subscription-plan.service";

export const fetchSubscriptionPlans = createAsyncThunk(
  "subscriptionPlan/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionPlanService.getAll();

      return response?.data ?? [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch subscription plans.",
      );
    }
  },
);

export const fetchSubscriptionPlanById = createAsyncThunk(
  "subscriptionPlan/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await subscriptionPlanService.getById(id);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch subscription plan.",
      );
    }
  },
);

export const createSubscriptionPlan = createAsyncThunk(
  "subscriptionPlan/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await subscriptionPlanService.create(payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create subscription plan.",
      );
    }
  },
);

export const updateSubscriptionPlan = createAsyncThunk(
  "subscriptionPlan/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await subscriptionPlanService.update(id, payload);

      return response?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update subscription plan.",
      );
    }
  },
);

export const deleteSubscriptionPlan = createAsyncThunk(
  "subscriptionPlan/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await subscriptionPlanService.delete(id);

      return {
        id,
        data: response?.data ?? null,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete subscription plan.",
      );
    }
  },
);
