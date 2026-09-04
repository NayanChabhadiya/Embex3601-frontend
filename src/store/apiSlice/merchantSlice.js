import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authHeader, authHeaderForm } from "../../helpers/authHelper";
import { axiosInstance } from "../../api/base";

const initialState = {
  merchants: [],
  status: null,
};

export const addMerchant = createAsyncThunk(
  "/merchantSlice/addMerchant",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/add-merchant`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);
export const updateMerchant = createAsyncThunk(
  "/merchantSlice/updateMerchant",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/update-merchant`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const getMerchantsByUser = createAsyncThunk(
  "/merchantSlice/getMerchantsByUser",
  async (body) => {
    try {
      const response = await axiosInstance.get(`/user/get-merchant/${body}`, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const deleteMerchant = createAsyncThunk(
  "/merchantSlice/deleteMerchant",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/delete-merchant`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const addMonthlyJobWork = createAsyncThunk(
  "/merchantSlice/addMonthlyJobWork",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/add-monthly-job-work`,
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

export const updateMonthlyJobWork = createAsyncThunk(
  "/merchantSlice/updateMonthlyJobWork",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/update-monthly-job-work`,
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

export const deleteMonthlyJobWork = createAsyncThunk(
  "/merchantSlice/deleteMonthlyJobWork",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/delete-monthly-job-work`,
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

export const addReceivedPayment = createAsyncThunk(
  "/merchantSlice/addReceivedPayment",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/add-received-amount`,
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

export const updateReceivedPayment = createAsyncThunk(
  "/merchantSlice/updateReceivedPayment",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/update-received-amount`,
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

export const deleteReceivedPayment = createAsyncThunk(
  "/merchantSlice/deleteReceivedPayment",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/delete-received-amount`,
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

export const assignUniqueIdToMerchant = createAsyncThunk(
  "/merchantSlice/assignUniqueIdToMerchant",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/merchant-uniqueId`,
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

const merchantSlice = createSlice({
  name: "merchants",
  initialState: initialState,
  reducers: {
    clearMerchantSlice: (state) => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getMerchantsByUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMerchantsByUser.fulfilled, (state, action) => {
        state.status = "success";
        state.merchants = action?.payload?.data;
      })
      .addCase(getMerchantsByUser.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearMerchantSlice } = merchantSlice.actions;
export default merchantSlice.reducer;
