import { createAsyncThunk } from "@reduxjs/toolkit";

import subscriptionPlanService from "../services/subscription-plan.service.js";

export const fetchSubscriptionPlans = createAsyncThunk(
  "subscriptionPlans/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response =
        await subscriptionPlanService.getSubscriptionPlans(params);
      return {
        plans: response.data?.data ?? [],
        meta: response.data?.meta ?? null,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Unable to fetch subscription plans.",
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const status = getState().subscriptionPlans?.status;

      return status !== "loading";
    },
  },
);

export const fetchSubscriptionPlanById = createAsyncThunk(
  "subscriptionPlans/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response =
        await subscriptionPlanService.getSubscriptionPlanById(id);

      return response.data?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Unable to fetch subscription plan.",
      );
    }
  },
);

/**
 * =============================================================================
 * Fetch Active Subscription Plans
 * =============================================================================
 */

export const fetchActiveSubscriptionPlans = createAsyncThunk(
  "subscriptionPlans/fetchActive",
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await subscriptionPlanService.getActiveSubscriptionPlans();

      return response.data?.data ?? [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ??
          "Unable to fetch active subscription plans.",
      );
    }
  },
);

/**
 * =============================================================================
 * Create Subscription Plan
 * =============================================================================
 */

export const createSubscriptionPlan = createAsyncThunk(
  "subscriptionPlans/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response =
        await subscriptionPlanService.createSubscriptionPlan(payload);

      return response.data?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Unable to create subscription plan.",
      );
    }
  },
);

export const updateSubscriptionPlan = createAsyncThunk(
  "subscriptionPlans/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await subscriptionPlanService.updateSubscriptionPlan(
        id,
        payload,
      );

      return response.data?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Unable to update subscription plan.",
      );
    }
  },
);

/**
 * =============================================================================
 * Activate Subscription Plan
 * =============================================================================
 */

export const activateSubscriptionPlan = createAsyncThunk(
  "subscriptionPlans/activate",
  async (id, { rejectWithValue }) => {
    try {
      const response =
        await subscriptionPlanService.activateSubscriptionPlan(id);

      return response.data?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ??
          "Unable to activate subscription plan.",
      );
    }
  },
);

/**
 * =============================================================================
 * Deactivate Subscription Plan
 * =============================================================================
 */

export const deactivateSubscriptionPlan = createAsyncThunk(
  "subscriptionPlans/deactivate",
  async (id, { rejectWithValue }) => {
    try {
      const response =
        await subscriptionPlanService.deactivateSubscriptionPlan(id);

      return response.data?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ??
          "Unable to deactivate subscription plan.",
      );
    }
  },
);

/**
 * =============================================================================
 * Delete Subscription Plan
 * =============================================================================
 */

export const deleteSubscriptionPlan = createAsyncThunk(
  "subscriptionPlans/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await subscriptionPlanService.deleteSubscriptionPlan(id);

      return {
        id,
        data: response.data?.data ?? null,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Unable to delete subscription plan.",
      );
    }
  },
);

/**
 * =============================================================================
 * Restore Subscription Plan
 * =============================================================================
 */

export const restoreSubscriptionPlan = createAsyncThunk(
  "subscriptionPlans/restore",
  async (id, { rejectWithValue }) => {
    try {
      const response =
        await subscriptionPlanService.restoreSubscriptionPlan(id);

      return response.data?.data ?? null;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ??
          "Unable to restore subscription plan.",
      );
    }
  },
);
