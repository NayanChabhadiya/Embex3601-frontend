// =============================================================================
// Subscription Payment Slice
// =============================================================================

import { createSlice } from "@reduxjs/toolkit";

import {
  createPaymentOrder,
  verifyPayment,
  getPaymentById,
} from "./subscription-payment.thunks.js";

// =============================================================================
// Initial State
// =============================================================================

const initialState = {
  currentPayment: null,
  createdPayment: null,

  paymentOrder: null,

  createOrderLoading: false,
  createOrderError: null,

  verifyLoading: false,
  verifyError: null,

  fetchLoading: false,
  fetchError: null,

  paymentVerified: false,
};

// =============================================================================
// Slice
// =============================================================================

const subscriptionPaymentSlice = createSlice({
  name: "subscriptionPayment",

  initialState,

  reducers: {
    clearCreatedPayment: (state) => {
      state.createdPayment = null;
      state.paymentOrder = null;
      state.createOrderError = null;
    },

    clearPaymentVerification: (state) => {
      state.verifyError = null;
      state.paymentVerified = false;
    },

    clearPaymentErrors: (state) => {
      state.createOrderError = null;
      state.verifyError = null;
      state.fetchError = null;
    },

    clearSubscriptionPaymentState: () => initialState,
  },

  extraReducers: (builder) => {
    // -------------------------------------------------------------------------
    // Create Payment Order
    // -------------------------------------------------------------------------

    builder
      .addCase(createPaymentOrder.pending, (state) => {
        state.createOrderLoading = true;
        state.createOrderError = null;
        state.createdPayment = null;
        state.paymentOrder = null;
      })

      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.createOrderLoading = false;

        state.createdPayment =
          action.payload?.data?.payment || action.payload?.payment || null;

        state.paymentOrder =
          action.payload?.data?.order || action.payload?.order || null;
      })

      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.createOrderLoading = false;
        state.createOrderError = action.payload;
      });

    // -------------------------------------------------------------------------
    // Verify / Submit Payment
    // -------------------------------------------------------------------------

    builder
      .addCase(verifyPayment.pending, (state) => {
        state.verifyLoading = true;
        state.verifyError = null;
        state.paymentVerified = false;
      })

      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.verifyLoading = false;

        const payment =
          action.payload?.data?.payment || action.payload?.payment || null;

        const subscription =
          action.payload?.data?.subscription ||
          action.payload?.subscription ||
          null;

        state.currentPayment = payment || state.currentPayment;

        // ---------------------------------------------------------------------
        // IMPORTANT:
        //
        // A successful API response only means the request was processed.
        // It does NOT automatically mean that the payment is verified.
        //
        // Manual payment remains pending until backend/admin verification.
        // ---------------------------------------------------------------------

        state.paymentVerified =
          payment?.paymentStatus === "captured" &&
          subscription?.status === "active";
      })

      .addCase(verifyPayment.rejected, (state, action) => {
        state.verifyLoading = false;
        state.verifyError = action.payload;
        state.paymentVerified = false;
      });

    // -------------------------------------------------------------------------
    // Get Payment By ID
    // -------------------------------------------------------------------------

    builder
      .addCase(getPaymentById.pending, (state) => {
        state.fetchLoading = true;
        state.fetchError = null;
      })

      .addCase(getPaymentById.fulfilled, (state, action) => {
        state.fetchLoading = false;

        state.currentPayment = action.payload?.data || action.payload || null;
      })

      .addCase(getPaymentById.rejected, (state, action) => {
        state.fetchLoading = false;
        state.fetchError = action.payload;
        state.currentPayment = null;
      });
  },
});

// =============================================================================
// Actions
// =============================================================================

export const {
  clearCreatedPayment,
  clearPaymentVerification,
  clearPaymentErrors,
  clearSubscriptionPaymentState,
} = subscriptionPaymentSlice.actions;

// =============================================================================
// Reducer
// =============================================================================

export default subscriptionPaymentSlice.reducer;
