// =============================================================================
// Company Slice
// =============================================================================

import { createSlice } from "@reduxjs/toolkit";

import { createCompany, getCompanies } from "./company.thunks.js";

// =============================================================================
// Initial State
// =============================================================================

const initialState = {
  companies: [],
  currentCompany: null,

  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },

  listStatus: "idle",
  listError: null,

  createStatus: "idle",
  createError: null,
  createSuccess: false,
};

// =============================================================================
// Slice
// =============================================================================

const companySlice = createSlice({
  name: "company",

  initialState,

  reducers: {
    clearCompanyCreateState: (state) => {
      state.createStatus = "idle";
      state.createError = null;
      state.createSuccess = false;
    },

    clearCompanyListError: (state) => {
      state.listError = null;
    },

    setCurrentCompany: (state, action) => {
      state.currentCompany = action.payload;
    },

    clearCurrentCompany: (state) => {
      state.currentCompany = null;
    },
  },

  extraReducers: (builder) => {
    // -------------------------------------------------------------------------
    // Create Company - Pending
    // -------------------------------------------------------------------------

    builder.addCase(createCompany.pending, (state) => {
      state.createStatus = "loading";
      state.createError = null;
      state.createSuccess = false;
    });

    // -------------------------------------------------------------------------
    // Create Company - Fulfilled
    // -------------------------------------------------------------------------

    builder.addCase(createCompany.fulfilled, (state, action) => {
      state.createStatus = "succeeded";
      state.createError = null;
      state.createSuccess = true;

      state.currentCompany = action.payload?.data || null;
    });

    // -------------------------------------------------------------------------
    // Create Company - Rejected
    // -------------------------------------------------------------------------

    builder.addCase(createCompany.rejected, (state, action) => {
      state.createStatus = "failed";
      state.createSuccess = false;

      state.createError =
        action.payload?.message ||
        action.payload?.errorCode ||
        action.payload ||
        "Failed to create company.";
    });

    // -------------------------------------------------------------------------
    // Get Companies - Pending
    // -------------------------------------------------------------------------

    builder.addCase(getCompanies.pending, (state) => {
      state.listStatus = "loading";
      state.listError = null;
    });

    // -------------------------------------------------------------------------
    // Get Companies - Fulfilled
    // -------------------------------------------------------------------------

    builder.addCase(getCompanies.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.listError = null;

      state.companies = action.payload?.data?.data || [];

      state.pagination =
        action.payload?.data?.meta || state.pagination;
    });

    // -------------------------------------------------------------------------
    // Get Companies - Rejected
    // -------------------------------------------------------------------------

    builder.addCase(getCompanies.rejected, (state, action) => {
      state.listStatus = "failed";

      state.listError =
        action.payload?.message ||
        action.payload?.errorCode ||
        action.payload ||
        "Failed to fetch companies.";
    });
  },
});

// =============================================================================
// Actions
// =============================================================================

export const {
  clearCompanyCreateState,
  clearCompanyListError,
  setCurrentCompany,
  clearCurrentCompany,
} = companySlice.actions;

// =============================================================================
// Export
// =============================================================================

export default companySlice.reducer;
