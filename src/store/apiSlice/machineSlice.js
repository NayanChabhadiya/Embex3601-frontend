import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authHeader } from "../../helpers/authHelper";
import { axiosInstance } from "../../api/base";

const initialState = {
  machines: [],
  status: null,
};

export const addMachine = createAsyncThunk(
  "/machineSlice/addMachine",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/add-machine`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const getMachinesByUser = createAsyncThunk(
  "/machineSlice/getMachinesByUser",
  async (body) => {
    try {
      const response = await axiosInstance.get(`/user/get-machine/${body}`, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);
export const updateMachine = createAsyncThunk(
  "/machineSlice/updateMachine",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/update-machine`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);
export const deleteMachine = createAsyncThunk(
  "/machineSlice/deleteMachine",
  async (body) => {
    try {
      const response = await axiosInstance.post(`/user/delete-machine`, body, {
        headers: authHeader(),
      });
      return response?.data;
    } catch (e) {
      return e?.response?.data;
    }
  }
);

export const allocateWorkerToMachine = createAsyncThunk(
  "/machineSlice/allocateWorkerToMachine",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/allocate-worker-to-machine`,
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
export const updateWorkerInMachine = createAsyncThunk(
  "/machineSlice/updateWorkerInMachine",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/update-worker-in-machine`,
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
export const deleteWorkerFromMachine = createAsyncThunk(
  "/machineSlice/deleteWorkerFromMachine",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/delete-worker-from-machine`,
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

export const addMachineProduction = createAsyncThunk(
  "/machineSlice/addMachineProduction",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/add-machine-production`,
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

export const updateMachineProduction = createAsyncThunk(
  "/machineSlice/updateMachineProduction",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/update-machine-production`,
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

export const deleteMachineProduction = createAsyncThunk(
  "/machineSlice/deleteMachineProduction",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/delete-machine-production`,
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

export const isWorkerBounusPaid = createAsyncThunk(
  "/machineSlice/isWorkerBounusPaid",
  async (body) => {
    try {
      const response = await axiosInstance.post(
        `/user/machine-worker-bonus-paid`,
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

const machineSlice = createSlice({
  name: "machines",
  initialState: initialState,
  reducers: {
    clearMachineSlice: (state) => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getMachinesByUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMachinesByUser.fulfilled, (state, action) => {
        state.status = "success";
        state.machines = action?.payload?.data;
      })
      .addCase(getMachinesByUser.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { clearMachineSlice } = machineSlice.actions;
export default machineSlice.reducer;
