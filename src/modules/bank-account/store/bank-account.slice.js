import { createSlice } from "@reduxjs/toolkit";

import {
  fetchBankAccounts,
  fetchBankAccountById,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
} from "./bank-account.thunks.js";

const initialState = {
  items: [],
  selected: null,

  status: "idle",
  detailsStatus: "idle",
  mutationStatus: "idle",

  error: null,
  detailsError: null,
  mutationError: null,

  lastCreated: null,
  lastUpdated: null,
  lastDeletedId: null,
};

const bankAccountSlice = createSlice({
  name: "bankAccount",

  initialState,

  reducers: {
    clearBankAccountError: (state) => {
      state.error = null;
      state.detailsError = null;
      state.mutationError = null;
    },

    clearSelectedBankAccount: (state) => {
      state.selected = null;
      state.detailsError = null;
    },

    clearBankAccountMutationState: (state) => {
      state.mutationStatus = "idle";
      state.mutationError = null;
      state.lastCreated = null;
      state.lastUpdated = null;
      state.lastDeletedId = null;
    },

    resetBankAccountState: () => initialState,
  },

  extraReducers: (builder) => {
    // ==========================================================
    // FETCH ALL BANK ACCOUNTS
    // ==========================================================

    builder
      .addCase(fetchBankAccounts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchBankAccounts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })

      .addCase(fetchBankAccounts.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to fetch bank accounts.";
      });

    // ==========================================================
    // FETCH BANK ACCOUNT BY ID
    // ==========================================================

    builder
      .addCase(fetchBankAccountById.pending, (state) => {
        state.detailsStatus = "loading";
        state.detailsError = null;
      })

      .addCase(fetchBankAccountById.fulfilled, (state, action) => {
        state.detailsStatus = "succeeded";
        state.selected = action.payload;
        state.detailsError = null;
      })

      .addCase(fetchBankAccountById.rejected, (state, action) => {
        state.detailsStatus = "failed";
        state.detailsError =
          action.payload ||
          action.error?.message ||
          "Failed to fetch bank account.";
      });

    // ==========================================================
    // CREATE BANK ACCOUNT
    // ==========================================================

    builder
      .addCase(createBankAccount.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
        state.lastCreated = null;
      })

      .addCase(createBankAccount.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.lastCreated = action.payload;
        state.mutationError = null;

        if (action.payload) {
          state.items.unshift(action.payload);
        }
      })

      .addCase(createBankAccount.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError =
          action.payload ||
          action.error?.message ||
          "Failed to create bank account.";
      });

    // ==========================================================
    // UPDATE BANK ACCOUNT
    // ==========================================================

    builder
      .addCase(updateBankAccount.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
        state.lastUpdated = null;
      })

      .addCase(updateBankAccount.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.lastUpdated = action.payload;
        state.mutationError = null;

        if (!action.payload) {
          return;
        }

        const index = state.items.findIndex(
          (item) => item._id === action.payload._id,
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }

        if (state.selected?._id === action.payload._id) {
          state.selected = action.payload;
        }
      })

      .addCase(updateBankAccount.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError =
          action.payload ||
          action.error?.message ||
          "Failed to update bank account.";
      });

    // ==========================================================
    // DELETE BANK ACCOUNT
    // ==========================================================

    builder
      .addCase(deleteBankAccount.pending, (state) => {
        state.mutationStatus = "loading";
        state.mutationError = null;
        state.lastDeletedId = null;
      })

      .addCase(deleteBankAccount.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.mutationError = null;

        const deletedId = action.payload?.id;

        state.lastDeletedId = deletedId || null;

        if (deletedId) {
          state.items = state.items.filter((item) => item._id !== deletedId);

          if (state.selected?._id === deletedId) {
            state.selected = null;
          }
        }
      })

      .addCase(deleteBankAccount.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.mutationError =
          action.payload ||
          action.error?.message ||
          "Failed to delete bank account.";
      });
  },
});

export const {
  clearBankAccountError,
  clearSelectedBankAccount,
  clearBankAccountMutationState,
  resetBankAccountState,
} = bankAccountSlice.actions;

export default bankAccountSlice.reducer;
