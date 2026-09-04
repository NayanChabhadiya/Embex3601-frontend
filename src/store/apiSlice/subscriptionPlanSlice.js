import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authHeader } from "../../helpers/authHelper";
import { axiosInstance } from "../../api/base";

const initialState = {
  subscriptionPlans: [],
  status: null,
};

export const addSubscriptionPlan = createAsyncThunk(
  "/subscriptionPlanSlice/addSubscriptionPlan",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/add-subscriptionPlan`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);
export const editSubscriptionPlan = createAsyncThunk(
  "/subscriptionPlanSlice/editSubscriptionPlan",
  async (body) => {
    try {
      const response = await axiosInstance.put(
        `/edit-subscriptionPlan/${body._id}`,
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

export const getSubscriptionPlans = createAsyncThunk(
  "/subscriptionPlanSlice/getSubscriptionPlans",
  async (body) => {
    try {
      const response = await axiosInstance.get(`/get-subscriptionPlans`, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const deleteSubscriptionPlan = createAsyncThunk(
  "/subscriptionPlanSlice/deleteSubscriptionPlan",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/delete-subscriptionPlan`,
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

const subscriptionPlanSlice = createSlice({
  name: "subscriptionPlans",
  initialState: initialState,
  reducers: {
    clearSubscriptionPlanSlice: (state) => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getSubscriptionPlans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSubscriptionPlans.fulfilled, (state, action) => {
        state.status = "success";
        state.subscriptionPlans = action?.payload?.data;
      })
      .addCase(getSubscriptionPlans.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearSubscriptionPlanSlice } = subscriptionPlanSlice.actions;
export default subscriptionPlanSlice.reducer;
