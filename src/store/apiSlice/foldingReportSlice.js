import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authHeader } from "../../helpers/authHelper";
import { axiosInstance } from "../../api/base";

const initialState = {
  foldingReports: [],
  status: null,
};

export const addFoldingReport = createAsyncThunk(
  "/foldingReportSlice/addFoldingReport",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/add-foldingReport`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);
export const updateFoldingReport = createAsyncThunk(
  "/foldingReportSlice/updateFoldingReport",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/update-foldingReport`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const getFoldingReportByUser = createAsyncThunk(
  "/foldingReportSlice/getFoldingReportByUser",
  async (body) => {
    try {
      const response = await axiosInstance.get(`/user/get-foldingReport/${body}`, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const deleteFoldingReport = createAsyncThunk(
  "/foldingReportSlice/deleteFoldingReport",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/delete-foldingReport`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

const foldingReportSlice = createSlice({
  name: "foldingReports",
  initialState: initialState,
  reducers: {
    clearFoldingReportSlice: (state) => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getFoldingReportByUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFoldingReportByUser.fulfilled, (state, action) => {
        state.status = "success";
        state.foldingReports = action?.payload?.data;
      })
      .addCase(getFoldingReportByUser.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearFoldingReportSlice } = foldingReportSlice.actions;
export default foldingReportSlice.reducer;
