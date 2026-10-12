// =============================================================================
// Company Thunks
// =============================================================================

import { createAsyncThunk } from "@reduxjs/toolkit";

import companyService from "../services/company.service.js";
import COMPANY_MESSAGES from "../constants/company.messages.js";

// =============================================================================
// Create Company
// =============================================================================

export const createCompany = createAsyncThunk(
  "company/createCompany",
  async (data, { rejectWithValue }) => {
    try {
      const response = await companyService.createCompany(data);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: COMPANY_MESSAGES.CREATE_FAILED,
        },
      );
    }
  },
);

// =============================================================================
// Get Companies
// =============================================================================

export const getCompanies = createAsyncThunk(
  "company/getCompanies",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await companyService.getCompanies(params);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: COMPANY_MESSAGES.LIST_FAILED,
        },
      );
    }
  },
);
