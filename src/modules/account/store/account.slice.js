// =============================================================================
// Account Slice
// =============================================================================

import { createSlice } from "@reduxjs/toolkit";

import {
  createAccount,
  getAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
} from "./account.thunks.js";

// =============================================================================
// Initial State
// =============================================================================

const initialState = {
  items: [],
  selectedAccount: null,

  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },

  loading: false,
  creating: false,
  updating: false,
  deleting: false,

  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

// =============================================================================
// Slice
// =============================================================================

const accountSlice = createSlice({
  name: "account",

  initialState,

  reducers: {
    clearAccountError: (state) => {
      state.error = null;
    },

    clearAccountCreateError: (state) => {
      state.createError = null;
    },

    clearAccountUpdateError: (state) => {
      state.updateError = null;
    },

    clearAccountDeleteError: (state) => {
      state.deleteError = null;
    },

    clearSelectedAccount: (state) => {
      state.selectedAccount = null;
    },

    resetAccountState: () => initialState,
  },

  extraReducers: (builder) => {
    // =========================================================================
    // Create Account
    // =========================================================================

    builder
      .addCase(createAccount.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })

      .addCase(createAccount.fulfilled, (state, action) => {
        state.creating = false;

        const account = action.payload?.data ?? action.payload;

        if (account) {
          state.items = [account, ...state.items];
          state.selectedAccount = account;
        }
      })

      .addCase(createAccount.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload || {
          message: "Failed to create account.",
        };
      });

    // =========================================================================
    // Get Accounts
    // =========================================================================

    builder
      .addCase(getAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAccounts.fulfilled, (state, action) => {
        state.loading = false;

        const response = action.payload?.data ?? action.payload;

        state.items = response?.items ?? [];

        state.pagination = response?.pagination ?? {
          page: 1,
          limit: 10,
          total: state.items.length,
          totalPages: state.items.length > 0 ? 1 : 0,
          hasNextPage: false,
          hasPreviousPage: false,
        };
      })

      .addCase(getAccounts.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || {
          message: "Failed to fetch accounts.",
        };
      });

    // =========================================================================
    // Get Account By ID
    // =========================================================================

    builder
      .addCase(getAccountById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAccountById.fulfilled, (state, action) => {
        state.loading = false;

        const account = action.payload?.data ?? action.payload;

        state.selectedAccount = account || null;
      })

      .addCase(getAccountById.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || {
          message: "Failed to fetch account.",
        };
      });

    // =========================================================================
    // Update Account
    // =========================================================================

    builder
      .addCase(updateAccount.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })

      .addCase(updateAccount.fulfilled, (state, action) => {
        state.updating = false;

        const updatedAccount = action.payload?.data ?? action.payload;

        if (!updatedAccount) {
          return;
        }

        state.selectedAccount = updatedAccount;

        const index = state.items.findIndex(
          (item) =>
            item._id === updatedAccount._id ||
            item.accountId === updatedAccount.accountId,
        );

        if (index !== -1) {
          state.items[index] = updatedAccount;
        }
      })

      .addCase(updateAccount.rejected, (state, action) => {
        state.updating = false;

        state.updateError = action.payload || {
          message: "Failed to update account.",
        };
      });

    // =========================================================================
    // Delete Account
    // =========================================================================

    builder
      .addCase(deleteAccount.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })

      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.deleting = false;

        const deletedAccount = action.payload?.data ?? action.payload;

        if (!deletedAccount) {
          return;
        }

        state.items = state.items.filter(
          (item) =>
            item._id !== deletedAccount._id &&
            item.accountId !== deletedAccount.accountId,
        );

        if (
          state.selectedAccount?._id === deletedAccount._id ||
          state.selectedAccount?.accountId === deletedAccount.accountId
        ) {
          state.selectedAccount = null;
        }

        if (state.pagination.total > 0) {
          state.pagination.total -= 1;
        }
      })

      .addCase(deleteAccount.rejected, (state, action) => {
        state.deleting = false;

        state.deleteError = action.payload || {
          message: "Failed to delete account.",
        };
      });
  },
});

// =============================================================================
// Actions
// =============================================================================

export const {
  clearAccountError,
  clearAccountCreateError,
  clearAccountUpdateError,
  clearAccountDeleteError,
  clearSelectedAccount,
  resetAccountState,
} = accountSlice.actions;

// =============================================================================
// Reducer
// =============================================================================

export default accountSlice.reducer;
