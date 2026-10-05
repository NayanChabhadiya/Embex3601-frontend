// =============================================================================
// Subscription Payment Slice
// =============================================================================

import { createSlice } from "@reduxjs/toolkit";

import {
  createPaymentOrder,
  verifyPayment,
  verifyManualPayment,
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

  manualVerifyLoading: false,
  manualVerifyError: null,
  manualPaymentVerified: false,

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

      state.manualVerifyError = null;
      state.manualPaymentVerified = false;
    },

    clearPaymentErrors: (state) => {
      state.createOrderError = null;
      state.verifyError = null;
      state.manualVerifyError = null;
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
    // Customer Verify / Submit Payment
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
        // A successful API response only means that the request was processed.
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
    // Platform Admin Manual Payment Verification
    // -------------------------------------------------------------------------

    builder
      .addCase(verifyManualPayment.pending, (state) => {
        state.manualVerifyLoading = true;
        state.manualVerifyError = null;
        state.manualPaymentVerified = false;
      })

      .addCase(verifyManualPayment.fulfilled, (state, action) => {
        state.manualVerifyLoading = false;

        const payment =
          action.payload?.data?.payment || action.payload?.payment || null;

        const subscription =
          action.payload?.data?.subscription ||
          action.payload?.subscription ||
          null;

        state.currentPayment = payment || state.currentPayment;

        // ---------------------------------------------------------------------
        // Payment is considered successfully verified only when backend
        // confirms both payment capture and subscription activation.
        // ---------------------------------------------------------------------

        state.manualPaymentVerified =
          payment?.paymentStatus === "captured" &&
          subscription?.status === "active";
      })

      .addCase(verifyManualPayment.rejected, (state, action) => {
        state.manualVerifyLoading = false;
        state.manualVerifyError = action.payload;
        state.manualPaymentVerified = false;
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
