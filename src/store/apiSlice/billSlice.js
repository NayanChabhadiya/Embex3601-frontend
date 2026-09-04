import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authHeader } from "../../helpers/authHelper";
import { axiosInstance } from "../../api/base";

const initialState = {
  bills: [],
  status: null,
};

export const addBill = createAsyncThunk("/billSlice/addBill", async (body) => {
  try {
    const response = await axiosInstance.post(`/user/add-bill`, body, {
      headers: authHeader(),
    });
    return response?.data;
  } catch (e) {
    return e?.response?.data;
  }
});
export const updateBill = createAsyncThunk(
  "/billSlice/updateBill",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/update-bill`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const getBillByUser = createAsyncThunk(
  "/billSlice/getBillByUser",
  async (body) => {
    try {
      const response = await axiosInstance.get(`/user/get-bill/${body}`, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const deleteBill = createAsyncThunk(
  "/billSlice/deleteBill",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/delete-bill`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

const billSlice = createSlice({
  name: "bills",
  initialState: initialState,
  reducers: {
    clearBillSlice: (state) => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getBillByUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBillByUser.fulfilled, (state, action) => {
        state.status = "success";
        state.bills = action?.payload?.data;
      })
      .addCase(getBillByUser.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearBillSlice } = billSlice.actions;
export default billSlice.reducer;
