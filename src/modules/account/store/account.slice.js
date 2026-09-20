import { createSlice } from "@reduxjs/toolkit";

import {
  fetchAccounts,
  fetchAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
} from "./account.thunks.js";

const initialState = {
  accounts: [],
  selectedAccount: null,
  status: "idle",
  error: null,
};

const accountSlice = createSlice({
  name: "account",

  initialState,

  reducers: {
    clearAccountError: (state) => {
      state.error = null;
    },

    clearSelectedAccount: (state) => {
      state.selectedAccount = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ============================================================
      // Fetch All Accounts
      // ============================================================

      .addCase(fetchAccounts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.accounts = action.payload ?? [];
      })

      .addCase(fetchAccounts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ============================================================
      // Fetch Account By ID
      // ============================================================

      .addCase(fetchAccountById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchAccountById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedAccount = action.payload ?? null;
      })

      .addCase(fetchAccountById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ============================================================
      // Create Account
      // ============================================================

      .addCase(createAccount.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(createAccount.fulfilled, (state, action) => {
        state.status = "succeeded";

        if (action.payload) {
          state.accounts.unshift(action.payload);
        }
      })

      .addCase(createAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ============================================================
      // Update Account
      // ============================================================

      .addCase(updateAccount.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(updateAccount.fulfilled, (state, action) => {
        state.status = "succeeded";

        const updatedAccount = action.payload;

        if (!updatedAccount) {
          return;
        }

        const index = state.accounts.findIndex(
          (account) => account._id === updatedAccount._id,
        );

        if (index !== -1) {
          state.accounts[index] = updatedAccount;
        }

        if (state.selectedAccount?._id === updatedAccount._id) {
          state.selectedAccount = updatedAccount;
        }
      })

      .addCase(updateAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ============================================================
      // Delete Account
      // ============================================================

      .addCase(deleteAccount.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.status = "succeeded";

        const deletedId = action.payload?.id;

        if (!deletedId) {
          return;
        }

        state.accounts = state.accounts.filter(
          (account) => account._id !== deletedId,
        );

        if (state.selectedAccount?._id === deletedId) {
          state.selectedAccount = null;
        }
      })

      .addCase(deleteAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearAccountError, clearSelectedAccount } = accountSlice.actions;

export default accountSlice.reducer;
