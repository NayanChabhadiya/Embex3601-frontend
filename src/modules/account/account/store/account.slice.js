// =============================================================================
// Account Slice
// =============================================================================

import { createSlice } from "@reduxjs/toolkit";

import { createAccount, getAccounts } from "./account.thunks.js";

// =============================================================================
// Initial State
// =============================================================================

const initialState = {
  accounts: [],
  currentAccount: null,

  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },

  listStatus: "idle",
  createStatus: "idle",

  listError: null,
  createError: null,

  createSuccess: false,
};

// =============================================================================
// Account Slice
// =============================================================================

const accountSlice = createSlice({
  name: "account",
  initialState,

  reducers: {
    clearAccountErrors: (state) => {
      state.listError = null;
      state.createError = null;
    },

    clearCreateAccountState: (state) => {
      state.createStatus = "idle";
      state.createError = null;
      state.createSuccess = false;
    },

    clearCurrentAccount: (state) => {
      state.currentAccount = null;
    },
  },

  extraReducers: (builder) => {
    // -------------------------------------------------------------------------
    // Create Account
    // -------------------------------------------------------------------------

    builder
      .addCase(createAccount.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
        state.createSuccess = false;
      })

      .addCase(createAccount.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.createError = null;
        state.createSuccess = true;

        const account = action.payload?.data;

        if (account) {
          state.currentAccount = account;

          state.accounts = [
            account,
            ...state.accounts.filter(
              (item) =>
                item._id !== account._id &&
                item.accountId !== account.accountId,
            ),
          ];
        }
      })

      .addCase(createAccount.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError =
          action.payload?.message || "Failed to create account.";
        state.createSuccess = false;
      });

    // -------------------------------------------------------------------------
    // Get Accounts
    // -------------------------------------------------------------------------

    builder
      .addCase(getAccounts.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })

      .addCase(getAccounts.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.listError = null;

        state.accounts = action.payload?.data || [];

        state.pagination = action.payload?.meta || {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        };
      })

      .addCase(getAccounts.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError =
          action.payload?.message || "Failed to fetch accounts.";
      });
  },
});

// =============================================================================
// Actions
// =============================================================================

export const {
  clearAccountErrors,
  clearCreateAccountState,
  clearCurrentAccount,
} = accountSlice.actions;

// =============================================================================
// Export
// =============================================================================

export default accountSlice.reducer;
