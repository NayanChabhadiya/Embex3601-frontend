// Get All

const selectSubscriptionPlanState = (state) => state.subscriptionPlans;

export const selectSubscriptionPlans = (state) =>
  selectSubscriptionPlanState(state).plans;

export const selectSubscriptionPlansStatus = (state) =>
  selectSubscriptionPlanState(state).status;

export const selectSubscriptionPlansError = (state) =>
  selectSubscriptionPlanState(state).error;

export const selectSubscriptionPlansLoading = (state) =>
  selectSubscriptionPlanState(state).status === "loading";

export const selectSubscriptionPlansLoaded = (state) =>
  selectSubscriptionPlanState(state).status === "succeeded";

export const selectSubscriptionPlansMeta = (state) =>
  selectSubscriptionPlanState(state).meta;

// Get By Id

export const selectSelectedSubscriptionPlan = (state) =>
  selectSubscriptionPlanState(state).selectedPlan;

export const selectSelectedSubscriptionPlanStatus = (state) =>
  selectSubscriptionPlanState(state).selectedPlanStatus;

export const selectSelectedSubscriptionPlanError = (state) =>
  selectSubscriptionPlanState(state).selectedPlanError;

export const selectSubscriptionPlanUpdateStatus = (state) =>
  selectSubscriptionPlanState(state).updateStatus;

export const selectSubscriptionPlanUpdateError = (state) =>
  selectSubscriptionPlanState(state).updateError;

export const selectSubscriptionPlanCreateStatus = (state) =>
  state.subscriptionPlans?.createStatus ?? "idle";

export const selectSubscriptionPlanCreateError = (state) =>
  state.subscriptionPlans?.createError ?? null;

export const selectSubscriptionPlanActivateStatus = (state) =>
  state.subscriptionPlans?.activateStatus ?? "idle";

export const selectSubscriptionPlanActivateError = (state) =>
  state.subscriptionPlans?.activateError ?? null;

export const selectSubscriptionPlanDeactivateStatus = (state) =>
  state.subscriptionPlans?.deactivateStatus ?? "idle";

export const selectSubscriptionPlanDeactivateError = (state) =>
  state.subscriptionPlans?.deactivateError ?? null;

export const selectSubscriptionPlanDeleteStatus = (state) =>
  state.subscriptionPlans?.deleteStatus ?? "idle";

export const selectSubscriptionPlanDeleteError = (state) =>
  state.subscriptionPlans?.deleteError ?? null;

export const selectSubscriptionPlanRestoreStatus = (state) =>
  state.subscriptionPlans?.restoreStatus ?? "idle";

export const selectSubscriptionPlanRestoreError = (state) =>
  state.subscriptionPlans?.restoreError ?? null;
