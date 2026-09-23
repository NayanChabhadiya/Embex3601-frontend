// ============================================================
// BRANCH STATE
// ============================================================

export const selectBranchState = (state) => state.branch;

// ============================================================
// BRANCHES
// ============================================================

export const selectBranches = (state) => state.branch?.branches ?? [];

// ============================================================
// SELECTED BRANCH
// ============================================================

export const selectSelectedBranch = (state) =>
  state.branch?.selectedBranch ?? null;

// ============================================================
// FETCH STATUS
// ============================================================

export const selectBranchStatus = (state) => state.branch?.status ?? "idle";

// ============================================================
// CREATE STATUS
// ============================================================

export const selectBranchCreateStatus = (state) =>
  state.branch?.createStatus ?? "idle";

// ============================================================
// UPDATE STATUS
// ============================================================

export const selectBranchUpdateStatus = (state) =>
  state.branch?.updateStatus ?? "idle";

// ============================================================
// DELETE STATUS
// ============================================================

export const selectBranchDeleteStatus = (state) =>
  state.branch?.deleteStatus ?? "idle";

// ============================================================
// ERROR
// ============================================================

export const selectBranchError = (state) => state.branch?.error ?? null;
