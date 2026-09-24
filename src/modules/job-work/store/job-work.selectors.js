// ============================================================
// STATE
// ============================================================

const selectJobWorkState = (state) => state.jobWork;

// ============================================================
// LIST
// ============================================================

export const selectJobWorks = (state) =>
  selectJobWorkState(state)?.jobWorks || [];

// ============================================================
// SELECTED
// ============================================================

export const selectSelectedJobWork = (state) =>
  selectJobWorkState(state)?.selectedJobWork || null;

// ============================================================
// STATUS
// ============================================================

export const selectJobWorkStatus = (state) =>
  selectJobWorkState(state)?.status || "idle";

// ============================================================
// SUBMIT STATUS
// ============================================================

export const selectJobWorkSubmitStatus = (state) =>
  selectJobWorkState(state)?.submitStatus || "idle";

// ============================================================
// ERROR
// ============================================================

export const selectJobWorkError = (state) =>
  selectJobWorkState(state)?.error || null;
