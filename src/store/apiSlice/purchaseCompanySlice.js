import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authHeader } from "../../helpers/authHelper";
import { axiosInstance } from "../../api/base";

const initialState = {
  purchaseCompanies: [],
  status: null,
};

export const addPurchaseCompany = createAsyncThunk(
  "/purchaseCompanySlice/addPurchaseCompany",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/add-purchaseCompany`,
        body,
        {
          headers: authHeader(),
        }
      );
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);
export const updatePurchaseCompany = createAsyncThunk(
  "/purchaseCompanySlice/updatePurchaseCompany",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/update-purchaseCompany`,
        body,
        {
          headers: authHeader(),
        }
      );
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const getPurchaseCompanyByUser = createAsyncThunk(
  "/purchaseCompanySlice/getPurchaseCompanyByUser",
  async (body) => {
    try {
      const response = await axiosInstance.get(
        `/user/get-purchaseCompany/${body}`,
        {
          headers: authHeader(),
        }
      );
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const deletePurchaseCompany = createAsyncThunk(
  "/purchaseCompanySlice/deletePurchaseCompany",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/delete-purchaseCompany`,
        body,
        {
          headers: authHeader(),
        }
      );
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const addMonthlyBill = createAsyncThunk(
  "/purchaseCompanySlice/addMonthlyBill",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/add-monthly-bill`,
        body,
        {
          headers: authHeader(),
        }
      );
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const updateMonthlyBill = createAsyncThunk(
  "/purchaseCompanySlice/updateMonthlyBill",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/update-monthly-bill`,
        body,
        {
          headers: authHeader(),
        }
      );
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const deleteMonthlyBill = createAsyncThunk(
  "/purchaseCompanySlice/deleteMonthlyBill",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/delete-monthly-bill`,
        body,
        {
          headers: authHeader(),
        }
      );
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const addPaidAmount = createAsyncThunk(
  "/purchaseCompanySlice/addPaidAmount",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/add-paid-amount`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const updatePaidAmount = createAsyncThunk(
  "/purchaseCompanySlice/updatePaidAmount",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/update-paid-amount`,
        body,
        {
          headers: authHeader(),
        }
      );
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const deletePaidAmount = createAsyncThunk(
  "/purchaseCompanySlice/deletePaidAmount",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/delete-paid-amount`,
        body,
        {
          headers: authHeader(),
        }
      );
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

const purchaseCompanySlice = createSlice({
  name: "purchaseCompanies",
  initialState: initialState,
  reducers: {
    clearPurchaseCompanySlice: (state) => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getPurchaseCompanyByUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPurchaseCompanyByUser.fulfilled, (state, action) => {
        state.status = "success";
        state.purchaseCompanies = action?.payload?.data;
      })
      .addCase(getPurchaseCompanyByUser.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearPurchaseCompanySlice } = purchaseCompanySlice.actions;
export default purchaseCompanySlice.reducer;
