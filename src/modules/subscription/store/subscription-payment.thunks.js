// =============================================================================
// Subscription Payment Thunks
// =============================================================================

import { createAsyncThunk } from "@reduxjs/toolkit";

import subscriptionPaymentService from "../services/subscription-payment.service.js";

// =============================================================================
// Create Payment Order
// =============================================================================

export const createPaymentOrder = createAsyncThunk(
  "subscriptionPayment/createPaymentOrder",
  async (paymentData, { rejectWithValue }) => {
    try {
      return await subscriptionPaymentService.createPaymentOrder(paymentData);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
          error?.message ||
          "Failed to create payment order.",
      );
    }
  },
);

// =============================================================================
// Verify Payment
// =============================================================================

export const verifyPayment = createAsyncThunk(
  "subscriptionPayment/verifyPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      return await subscriptionPaymentService.verifyPayment(paymentData);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error?.message || "Failed to verify payment.",
      );
    }
  },
);

// =============================================================================
// Verify Manual Payment
// =============================================================================
//
// Platform Admin verifies a customer-submitted manual payment / UTR.
// The backend performs the actual authorization and payment verification.
//
// =============================================================================

export const verifyManualPayment = createAsyncThunk(
  "subscriptionPayment/verifyManualPayment",
  async (paymentId, { rejectWithValue }) => {
    try {
      return await subscriptionPaymentService.verifyManualPayment(paymentId);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
          error?.message ||
          "Failed to verify manual payment.",
      );
    }
  },
);

// =============================================================================
// Get Payment By ID
// =============================================================================

export const getPaymentById = createAsyncThunk(
  "subscriptionPayment/getPaymentById",
  async (paymentId, { rejectWithValue }) => {
    try {
      return await subscriptionPaymentService.getPaymentById(paymentId);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error?.message || "Failed to fetch payment.",
      );
    }
  },
);
