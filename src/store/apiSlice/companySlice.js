import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authHeader } from "../../helpers/authHelper";
import { axiosInstance } from "../../api/base";

const initialState = {
  companies: [],
  status: null,
};

export const addCompany = createAsyncThunk(
  "/companySlice/addCompany",
  async (data) => {
    try {
      const response = await axiosInstance.post(`/user/add-company`, data, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const getCompaniesByUser = createAsyncThunk(
  "/companySlice/getCompaniesByUser",
  async (body) => {
    try {
      const response = await axiosInstance.get(`/user/get-company/${body}`, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const updateCompany = createAsyncThunk(
  "/companySlice/updateCompany",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/update-company`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const deleteCompany = createAsyncThunk(
  "/companySlice/deleteCompany",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/delete-company`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState: initialState,
  reducers: {
    clearCompanySlice: (state) => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getCompaniesByUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCompaniesByUser.fulfilled, (state, action) => {
        state.status = "success";
        state.companies = action?.payload?.data;
      })
      .addCase(getCompaniesByUser.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearCompanySlice } = companySlice.actions;
export default companySlice.reducer;
