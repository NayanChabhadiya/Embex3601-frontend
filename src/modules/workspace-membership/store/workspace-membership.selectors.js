// ============================================================
// WORKSPACE MEMBERSHIPS
// ============================================================

export const selectWorkspaceMemberships = (state) =>
  state.workspaceMembership?.memberships || [];

// ============================================================
// SELECTED WORKSPACE MEMBERSHIP
// ============================================================

export const selectSelectedWorkspaceMembership = (state) =>
  state.workspaceMembership?.selectedMembership || null;

// ============================================================
// LIST STATUS
// ============================================================

export const selectWorkspaceMembershipStatus = (state) =>
  state.workspaceMembership?.status || "idle";

// ============================================================
// SELECTED MEMBERSHIP STATUS
// ============================================================

export const selectSelectedWorkspaceMembershipStatus = (state) =>
  state.workspaceMembership?.selectedStatus || "idle";

// ============================================================
// CREATE / UPDATE / DELETE STATUS
// ============================================================

export const selectWorkspaceMembershipMutationStatus = (state) =>
  state.workspaceMembership?.mutationStatus || "idle";

// ============================================================
// ERROR
// ============================================================

export const selectWorkspaceMembershipError = (state) =>
  state.workspaceMembership?.error || null;
