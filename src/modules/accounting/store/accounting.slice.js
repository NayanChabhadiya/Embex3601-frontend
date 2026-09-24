import { createSlice } from "@reduxjs/toolkit";

import {
  getAccountingTransactions,
  getAccountingById,
  createAccounting,
  updateAccounting,
  deleteAccounting,
} from "./accounting.thunks.js";

// ============================================================
// INITIAL STATE
// ============================================================

const initialState = {
  transactions: [],
  selectedTransaction: null,

  status: "idle",
  detailStatus: "idle",
  mutationStatus: "idle",

  error: null,
};

// ============================================================
// SLICE
// ============================================================

const accountingSlice = createSlice({
  name: "accounting",

  initialState,

  reducers: {
    clearSelectedTransaction: (state) => {
      state.selectedTransaction = null;
    },

    clearAccountingError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // --------------------------------------------------------
    // GET LIST
    // --------------------------------------------------------

    builder
      .addCase(getAccountingTransactions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(getAccountingTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.transactions = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.transactions || [];
      })

      .addCase(getAccountingTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload || "Failed to fetch accounting transactions.";
      });

    // --------------------------------------------------------
    // GET BY ID
    // --------------------------------------------------------

    builder
      .addCase(getAccountingById.pending, (state) => {
        state.detailStatus = "loading";
        state.error = null;
      })

      .addCase(getAccountingById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";

        state.selectedTransaction = action.payload || null;
      })

      .addCase(getAccountingById.rejected, (state, action) => {
        state.detailStatus = "failed";

        state.error =
          action.payload || "Failed to fetch accounting transaction.";
      });

    // --------------------------------------------------------
    // CREATE
    // --------------------------------------------------------

    builder
      .addCase(createAccounting.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })

      .addCase(createAccounting.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";

        if (action.payload) {
          state.transactions.unshift(action.payload);
        }
      })

      .addCase(createAccounting.rejected, (state, action) => {
        state.mutationStatus = "failed";

        state.error =
          action.payload || "Failed to create accounting transaction.";
      });

    // --------------------------------------------------------
    // UPDATE
    // --------------------------------------------------------

    builder
      .addCase(updateAccounting.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })

      .addCase(updateAccounting.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";

        const updated = action.payload;

        if (!updated?._id) {
          return;
        }

        state.transactions = state.transactions.map((transaction) =>
          transaction._id === updated._id ? updated : transaction,
        );

        state.selectedTransaction = updated;
      })

      .addCase(updateAccounting.rejected, (state, action) => {
        state.mutationStatus = "failed";

        state.error =
          action.payload || "Failed to update accounting transaction.";
      });

    // --------------------------------------------------------
    // DELETE
    // --------------------------------------------------------

    builder
      .addCase(deleteAccounting.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })

      .addCase(deleteAccounting.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";

        const deletedId = action.meta?.arg;

        state.transactions = state.transactions.filter(
          (transaction) => transaction._id !== deletedId,
        );

        if (state.selectedTransaction?._id === deletedId) {
          state.selectedTransaction = null;
        }
      })

      .addCase(deleteAccounting.rejected, (state, action) => {
        state.mutationStatus = "failed";

        state.error =
          action.payload || "Failed to delete accounting transaction.";
      });
  },
});

export const { clearSelectedTransaction, clearAccountingError } =
  accountingSlice.actions;

export default accountingSlice.reducer;
