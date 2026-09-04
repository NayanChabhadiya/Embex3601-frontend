import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authHeader } from "../../helpers/authHelper";
import { axiosInstance } from "../../api/base";

const initialState = {
  workers: [],
  status: null,
};

export const addWorker = createAsyncThunk(
  "/workerSlice/addWorker",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/add-worker`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);
export const updateWorker = createAsyncThunk(
  "/workerSlice/updateWorker",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/update-worker`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const getWorkerByUser = createAsyncThunk(
  "/workerSlice/getWorkerByUser",
  async (body) => {
    try {
      const response = await axiosInstance.get(`/user/get-worker/${body}`, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const deleteWorker = createAsyncThunk(
  "/workerSlice/deleteWorker",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/delete-worker`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const addWorkerAdvance = createAsyncThunk(
  "/workerSlice/addWorkerAdvance",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/add-worker-advance`,
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

export const updateWorkerAdvance = createAsyncThunk(
  "/workerSlice/updateWorkerAdvance",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/update-worker-advance`,
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

export const deleteWorkerAdvance = createAsyncThunk(
  "/workerSlice/deleteWorkerAdvance",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/delete-worker-advance`,
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

export const addWorkerLeave = createAsyncThunk(
  "/workerSlice/addWorkerLeave",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/add-worker-leave`,
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

export const updateWorkerLeave = createAsyncThunk(
  "/workerSlice/updateWorkerLeave",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/update-worker-leave`,
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

export const deleteWorkerLeave = createAsyncThunk(
  "/workerSlice/deleteWorkerLeave",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/delete-worker-leave`,
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

const workerSlice = createSlice({
  name: "workers",
  initialState: initialState,
  reducers: {
    clearWorkerSlice: (state) => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getWorkerByUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getWorkerByUser.fulfilled, (state, action) => {
        state.status = "success";
        state.workers = action?.payload?.data;
      })
      .addCase(getWorkerByUser.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearWorkerSlice } = workerSlice.actions;
export default workerSlice.reducer;
