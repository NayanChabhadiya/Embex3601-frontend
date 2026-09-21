// ============================================================
// HSN / SAC STATE
// ============================================================

export const selectHsnSacState = (state) => state.hsnSac;

// ============================================================
// HSN / SAC LIST
// ============================================================

export const selectHsnSacList = (state) => state.hsnSac?.hsnSacList ?? [];

// ============================================================
// SELECTED HSN / SAC
// ============================================================

export const selectSelectedHsnSac = (state) =>
  state.hsnSac?.selectedHsnSac ?? null;

// ============================================================
// FETCH STATUS
// ============================================================

export const selectHsnSacStatus = (state) => state.hsnSac?.status ?? "idle";

// ============================================================
// CREATE STATUS
// ============================================================

export const selectHsnSacCreateStatus = (state) =>
  state.hsnSac?.createStatus ?? "idle";

// ============================================================
// UPDATE STATUS
// ============================================================

export const selectHsnSacUpdateStatus = (state) =>
  state.hsnSac?.updateStatus ?? "idle";

// ============================================================
// DELETE STATUS
// ============================================================

export const selectHsnSacDeleteStatus = (state) =>
  state.hsnSac?.deleteStatus ?? "idle";

// ============================================================
// ERROR
// ============================================================

export const selectHsnSacError = (state) => state.hsnSac?.error ?? null;
