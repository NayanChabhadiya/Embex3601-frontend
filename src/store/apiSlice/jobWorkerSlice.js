import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authHeader } from "../../helpers/authHelper";
import { axiosInstance } from "../../api/base";

const initialState = {
  jobWorkers: [],
  status: null,
};

export const addJobWorker = createAsyncThunk(
  "/jobWorkerSlice/addJobWorker",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/add-jobWorker`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);
export const updateJobWorker = createAsyncThunk(
  "/jobWorkerSlice/updateJobWorker",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/update-jobWorker`,
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

export const getJobWorkerByUser = createAsyncThunk(
  "/jobWorkerSlice/getJobWorkerByUser",
  async (body) => {
    try {
      const response = await axiosInstance.get(`/user/get-jobWorker/${body}`, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const deleteJobWorker = createAsyncThunk(
  "/jobWorkerSlice/deleteJobWorker",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/delete-jobWorker`,
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

const jobWorkerSlice = createSlice({
  name: "jobWorkers",
  initialState: initialState,
  reducers: {
    clearJobWorkerSlice: (state) => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getJobWorkerByUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getJobWorkerByUser.fulfilled, (state, action) => {
        state.status = "success";
        state.jobWorkers = action?.payload?.data;
      })
      .addCase(getJobWorkerByUser.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearJobWorkerSlice } = jobWorkerSlice.actions;
export default jobWorkerSlice.reducer;
