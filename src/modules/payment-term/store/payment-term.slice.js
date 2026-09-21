import { createSlice } from "@reduxjs/toolkit";

import {
  fetchPaymentTerms,
  fetchPaymentTermById,
  createPaymentTerm,
  updatePaymentTerm,
  deletePaymentTerm,
} from "./payment-term.thunks.js";

// ============================================================
// INITIAL STATE
// ============================================================

const initialState = {
  items: [],
  selectedPaymentTerm: null,

  status: "idle",
  error: null,
};

// ============================================================
// SLICE
// ============================================================

const paymentTermSlice = createSlice({
  name: "paymentTerm",

  initialState,

  reducers: {
    // ========================================================
    // CLEAR SELECTED PAYMENT TERM
    // ========================================================

    clearSelectedPaymentTerm: (state) => {
      state.selectedPaymentTerm = null;
    },

    // ========================================================
    // CLEAR ERROR
    // ========================================================

    clearPaymentTermError: (state) => {
      state.error = null;
    },

    // ========================================================
    // RESET STATE
    // ========================================================

    resetPaymentTermState: () => {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // ========================================================
    // GET ALL PAYMENT TERMS
    // ========================================================

    builder
      .addCase(fetchPaymentTerms.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchPaymentTerms.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload || [];
        state.error = null;
      })

      .addCase(fetchPaymentTerms.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch payment terms.";
      });

    // ========================================================
    // GET PAYMENT TERM BY ID
    // ========================================================

    builder
      .addCase(fetchPaymentTermById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchPaymentTermById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedPaymentTerm = action.payload || null;
        state.error = null;
      })

      .addCase(fetchPaymentTermById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch payment term.";
      });

    // ========================================================
    // CREATE PAYMENT TERM
    // ========================================================

    builder
      .addCase(createPaymentTerm.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(createPaymentTerm.fulfilled, (state, action) => {
        state.status = "succeeded";

        if (action.payload) {
          state.items.unshift(action.payload);
        }

        state.error = null;
      })

      .addCase(createPaymentTerm.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to create payment term.";
      });

    // ========================================================
    // UPDATE PAYMENT TERM
    // ========================================================

    builder
      .addCase(updatePaymentTerm.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(updatePaymentTerm.fulfilled, (state, action) => {
        state.status = "succeeded";

        const updatedPaymentTerm = action.payload;

        if (!updatedPaymentTerm) {
          return;
        }

        const index = state.items.findIndex(
          (item) => item._id === updatedPaymentTerm._id,
        );

        if (index !== -1) {
          state.items[index] = updatedPaymentTerm;
        }

        if (state.selectedPaymentTerm?._id === updatedPaymentTerm._id) {
          state.selectedPaymentTerm = updatedPaymentTerm;
        }

        state.error = null;
      })

      .addCase(updatePaymentTerm.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update payment term.";
      });

    // ========================================================
    // DELETE PAYMENT TERM
    // ========================================================

    builder
      .addCase(deletePaymentTerm.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(deletePaymentTerm.fulfilled, (state, action) => {
        state.status = "succeeded";

        const deletedId = action.payload?.id;

        if (deletedId) {
          state.items = state.items.filter((item) => item._id !== deletedId);
        }

        if (state.selectedPaymentTerm?._id === deletedId) {
          state.selectedPaymentTerm = null;
        }

        state.error = null;
      })

      .addCase(deletePaymentTerm.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete payment term.";
      });
  },
});

// ============================================================
// ACTIONS
// ============================================================

export const {
  clearSelectedPaymentTerm,
  clearPaymentTermError,
  resetPaymentTermState,
} = paymentTermSlice.actions;

// ============================================================
// REDUCER
// ============================================================

export default paymentTermSlice.reducer;
