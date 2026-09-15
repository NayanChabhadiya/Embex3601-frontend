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
