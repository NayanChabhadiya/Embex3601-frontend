// ============================================================
// ITEM SELECTORS
// ============================================================

// ALL ITEMS
export const selectItems = (state) => state.item?.items || [];

// SELECTED ITEM
export const selectSelectedItem = (state) => state.item?.selectedItem || null;

// GENERAL STATUS
export const selectItemStatus = (state) => state.item?.status || "idle";

// CREATE STATUS
export const selectItemCreateStatus = (state) =>
  state.item?.createStatus || "idle";

// UPDATE STATUS
export const selectItemUpdateStatus = (state) =>
  state.item?.updateStatus || "idle";

// DELETE STATUS
export const selectItemDeleteStatus = (state) =>
  state.item?.deleteStatus || "idle";

// ERROR
export const selectItemError = (state) => state.item?.error || null;

// LOADING
export const selectItemLoading = (state) => state.item?.status === "loading";

// CREATE LOADING
export const selectItemCreateLoading = (state) =>
  state.item?.createStatus === "loading";

// UPDATE LOADING
export const selectItemUpdateLoading = (state) =>
  state.item?.updateStatus === "loading";

// DELETE LOADING
export const selectItemDeleteLoading = (state) =>
  state.item?.deleteStatus === "loading";
