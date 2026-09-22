import { createSlice } from "@reduxjs/toolkit";

import {
  fetchCompanies,
  fetchCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
} from "./company.thunks.js";

// ============================================================
// INITIAL STATE
// ============================================================

const initialState = {
  companies: [],
  selectedCompany: null,

  status: "idle",
  createStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",

  error: null,
};

// ============================================================
// SLICE
// ============================================================

const companySlice = createSlice({
  name: "company",

  initialState,

  reducers: {
    // --------------------------------------------------------
    // CLEAR ERROR
    // --------------------------------------------------------

    clearCompanyError: (state) => {
      state.error = null;
    },

    // --------------------------------------------------------
    // CLEAR SELECTED COMPANY
    // --------------------------------------------------------

    clearSelectedCompany: (state) => {
      state.selectedCompany = null;
    },

    // --------------------------------------------------------
    // RESET STATE
    // --------------------------------------------------------

    resetCompanyState: () => initialState,
  },

  extraReducers: (builder) => {
    // ========================================================
    // FETCH ALL COMPANIES
    // ========================================================

    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.companies = action.payload || [];
      })

      .addCase(fetchCompanies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch companies.";
      });

    // ========================================================
    // FETCH COMPANY BY ID
    // ========================================================

    builder
      .addCase(fetchCompanyById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedCompany = action.payload || null;
      })

      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch company.";
      });

    // ========================================================
    // CREATE COMPANY
    // ========================================================

    builder
      .addCase(createCompany.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })

      .addCase(createCompany.fulfilled, (state, action) => {
        state.createStatus = "succeeded";

        if (action.payload) {
          state.companies.unshift(action.payload);
        }
      })

      .addCase(createCompany.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.payload || "Failed to create company.";
      });

    // ========================================================
    // UPDATE COMPANY
    // ========================================================

    builder
      .addCase(updateCompany.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })

      .addCase(updateCompany.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";

        const updatedCompany = action.payload;

        if (!updatedCompany?._id) {
          return;
        }

        const index = state.companies.findIndex(
          (company) => company._id === updatedCompany._id,
        );

        if (index !== -1) {
          state.companies[index] = updatedCompany;
        }

        if (state.selectedCompany?._id === updatedCompany._id) {
          state.selectedCompany = updatedCompany;
        }
      })

      .addCase(updateCompany.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload || "Failed to update company.";
      });

    // ========================================================
    // DELETE COMPANY
    // ========================================================

    builder
      .addCase(deleteCompany.pending, (state) => {
        state.deleteStatus = "loading";
        state.error = null;
      })

      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";

        const deletedId = action.payload?.id;

        if (!deletedId) {
          return;
        }

        state.companies = state.companies.filter(
          (company) => company._id !== deletedId,
        );

        if (state.selectedCompany?._id === deletedId) {
          state.selectedCompany = null;
        }
      })

      .addCase(deleteCompany.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.error = action.payload || "Failed to delete company.";
      });
  },
});

// ============================================================
// ACTIONS
// ============================================================

export const { clearCompanyError, clearSelectedCompany, resetCompanyState } =
  companySlice.actions;

// ============================================================
// REDUCER
// ============================================================

export default companySlice.reducer;
