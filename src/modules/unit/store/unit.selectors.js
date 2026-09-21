// ============================================================
// UNIT SELECTORS
// ============================================================

export const selectUnitState = (state) => state.unit;

// ============================================================
// ALL UNITS
// ============================================================

export const selectUnits = (state) => state.unit?.units || [];

// ============================================================
// SELECTED UNIT
// ============================================================

export const selectSelectedUnit = (state) => state.unit?.selectedUnit || null;

// ============================================================
// FETCH STATUS
// ============================================================

export const selectUnitStatus = (state) => state.unit?.status || "idle";

// ============================================================
// SELECTED UNIT STATUS
// ============================================================

export const selectSelectedUnitStatus = (state) =>
  state.unit?.selectedStatus || "idle";

// ============================================================
// CREATE / UPDATE / DELETE STATUS
// ============================================================

export const selectUnitMutationStatus = (state) =>
  state.unit?.mutationStatus || "idle";

// ============================================================
// ERROR
// ============================================================

export const selectUnitError = (state) => state.unit?.error || null;

// ============================================================
// LOADING
// ============================================================

export const selectUnitsLoading = (state) => state.unit?.status === "loading";

export const selectUnitMutationLoading = (state) =>
  state.unit?.mutationStatus === "loading";

export const selectSelectedUnitLoading = (state) =>
  state.unit?.selectedStatus === "loading";
