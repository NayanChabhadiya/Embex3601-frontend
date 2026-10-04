import { createSlice } from "@reduxjs/toolkit";

import {
  createSubscriptionPlan,
  getSubscriptionPlans,
  getAvailableSubscriptionPlans,
} from "./subscription-plan.thunks.js";

// --------------------------------------------------------------------------
// Initial State
// --------------------------------------------------------------------------

const initialState = {
  // ------------------------------------------------------------------------
  // Subscription Plans List - Platform Admin
  // ------------------------------------------------------------------------

  subscriptionPlans: [],

  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },

  listLoading: false,
  listError: null,

  // ------------------------------------------------------------------------
  // Available Subscription Plans - Customer
  // ------------------------------------------------------------------------

  availableSubscriptionPlans: [],

  availablePagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },

  availableLoading: false,
  availableError: null,

  // ------------------------------------------------------------------------
  // Create Subscription Plan - Platform Admin
  // ------------------------------------------------------------------------

  createLoading: false,
  createError: null,
  createdSubscriptionPlan: null,
};

// --------------------------------------------------------------------------
// Subscription Plan Slice
// --------------------------------------------------------------------------

const subscriptionPlanSlice = createSlice({
  name: "subscriptionPlan",

  initialState,

  reducers: {
    // ----------------------------------------------------------------------
    // Clear Created Subscription Plan
    // ----------------------------------------------------------------------

    clearCreatedSubscriptionPlan: (state) => {
      state.createdSubscriptionPlan = null;
      state.createError = null;
    },

    // ----------------------------------------------------------------------
    // Clear Subscription Plan Errors
    // ----------------------------------------------------------------------

    clearSubscriptionPlanErrors: (state) => {
      state.listError = null;
      state.createError = null;
      state.availableError = null;
    },

    // ----------------------------------------------------------------------
    // Clear Available Subscription Plans
    // ----------------------------------------------------------------------

    clearAvailableSubscriptionPlans: (state) => {
      state.availableSubscriptionPlans = [];

      state.availablePagination = {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      state.availableError = null;
    },
  },

  extraReducers: (builder) => {
    // ======================================================================
    // Create Subscription Plan - Platform Admin
    // ======================================================================

    builder
      .addCase(createSubscriptionPlan.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createdSubscriptionPlan = null;
      })

      .addCase(createSubscriptionPlan.fulfilled, (state, action) => {
        state.createLoading = false;

        state.createdSubscriptionPlan =
          action.payload?.data || action.payload || null;
      })

      .addCase(createSubscriptionPlan.rejected, (state, action) => {
        state.createLoading = false;

        state.createError =
          action.payload || "Failed to create subscription plan.";
      });

    // ======================================================================
    // Get Subscription Plans - Platform Admin
    // ======================================================================

    builder
      .addCase(getSubscriptionPlans.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })

      .addCase(getSubscriptionPlans.fulfilled, (state, action) => {
        state.listLoading = false;

        const response = action.payload || {};

        state.subscriptionPlans = response.data || [];

        state.pagination = response.meta || state.pagination;
      })

      .addCase(getSubscriptionPlans.rejected, (state, action) => {
        state.listLoading = false;

        state.listError =
          action.payload || "Failed to fetch subscription plans.";
      });

    // ======================================================================
    // Get Available Subscription Plans - Customer
    // ======================================================================

    builder
      .addCase(getAvailableSubscriptionPlans.pending, (state) => {
        state.availableLoading = true;
        state.availableError = null;
      })

      .addCase(getAvailableSubscriptionPlans.fulfilled, (state, action) => {
        state.availableLoading = false;

        const response = action.payload || {};

        state.availableSubscriptionPlans = response.data || [];

        state.availablePagination = response.meta || state.availablePagination;
      })

      .addCase(getAvailableSubscriptionPlans.rejected, (state, action) => {
        state.availableLoading = false;

        state.availableError =
          action.payload || "Failed to fetch available subscription plans.";
      });
  },
});

// --------------------------------------------------------------------------
// Actions
// --------------------------------------------------------------------------

export const {
  clearCreatedSubscriptionPlan,
  clearSubscriptionPlanErrors,
  clearAvailableSubscriptionPlans,
} = subscriptionPlanSlice.actions;

// --------------------------------------------------------------------------
// Reducer
// --------------------------------------------------------------------------

export default subscriptionPlanSlice.reducer;
