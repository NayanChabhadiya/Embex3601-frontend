import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: true,
  isLoading: false,
};
export const componentSlice = createSlice({
  name: "components",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebar(state, action) {
      state.isSidebarOpen = action.payload;
    },
    startLoading(state) {
      state.isLoading = true;
    },
    stopLoading(state) {
      state.isLoading = false;
    },
  },
});

export const { toggleSidebar, setSidebar, startLoading, stopLoading } =
  componentSlice.actions;
export const selectComponents = (state) => state.components;

export default componentSlice.reducer;
