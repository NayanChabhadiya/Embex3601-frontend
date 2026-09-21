// ============================================================
// WORKSPACE SUBSCRIPTIONS
// ============================================================

export const selectWorkspaceSubscriptions = (state) =>
  state.workspaceSubscription?.subscriptions || [];

// ============================================================
// SELECTED WORKSPACE SUBSCRIPTION
// ============================================================

export const selectSelectedWorkspaceSubscription = (state) =>
  state.workspaceSubscription?.selectedSubscription || null;

// ============================================================
// LIST STATUS
// ============================================================

export const selectWorkspaceSubscriptionStatus = (state) =>
  state.workspaceSubscription?.status || "idle";

// ============================================================
// SELECTED SUBSCRIPTION STATUS
// ============================================================

export const selectSelectedWorkspaceSubscriptionStatus = (state) =>
  state.workspaceSubscription?.selectedStatus || "idle";

// ============================================================
// CREATE / UPDATE / DELETE STATUS
// ============================================================

export const selectWorkspaceSubscriptionMutationStatus = (state) =>
  state.workspaceSubscription?.mutationStatus || "idle";

// ============================================================
// ERROR
// ============================================================

export const selectWorkspaceSubscriptionError = (state) =>
  state.workspaceSubscription?.error || null;
