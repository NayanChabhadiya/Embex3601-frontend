import { createSlice } from "@reduxjs/toolkit";

import {
  createSubscription,
  getActiveSubscription,
} from "./subscription.thunks.js";

// --------------------------------------------------------------------------
// Initial State
// --------------------------------------------------------------------------

const initialState = {
  activeSubscription: null,

  createLoading: false,
  createError: null,
  createdSubscription: null,

  activeLoading: false,
  activeError: null,
};

// --------------------------------------------------------------------------
// Slice
// --------------------------------------------------------------------------

const subscriptionSlice = createSlice({
  name: "subscription",

  initialState,

  reducers: {
    clearCreatedSubscription: (state) => {
      state.createdSubscription = null;
      state.createError = null;
    },

    clearActiveSubscriptionError: (state) => {
      state.activeError = null;
    },

    clearSubscriptionErrors: (state) => {
      state.createError = null;
      state.activeError = null;
    },

    clearSubscriptionState: () => initialState,
  },

  extraReducers: (builder) => {
    // ----------------------------------------------------------------------
    // Create Subscription
    // ----------------------------------------------------------------------

    builder
      .addCase(createSubscription.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createdSubscription = null;
      })

      .addCase(createSubscription.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createdSubscription = action.payload;
      })

      .addCase(createSubscription.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      });

    // ----------------------------------------------------------------------
    // Get Active Subscription
    // ----------------------------------------------------------------------

    builder
      .addCase(getActiveSubscription.pending, (state) => {
        state.activeLoading = true;
        state.activeError = null;
      })

      .addCase(getActiveSubscription.fulfilled, (state, action) => {
        state.activeLoading = false;
        state.activeSubscription = action.payload;
      })

      .addCase(getActiveSubscription.rejected, (state, action) => {
        state.activeLoading = false;
        state.activeError = action.payload;
        state.activeSubscription = null;
      });
  },
});

// --------------------------------------------------------------------------
// Actions
// --------------------------------------------------------------------------

export const {
  clearCreatedSubscription,
  clearActiveSubscriptionError,
  clearSubscriptionErrors,
  clearSubscriptionState,
} = subscriptionSlice.actions;

// --------------------------------------------------------------------------
// Reducer
// --------------------------------------------------------------------------

export default subscriptionSlice.reducer;
