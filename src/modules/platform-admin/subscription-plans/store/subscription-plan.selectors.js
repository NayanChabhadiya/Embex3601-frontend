export const selectSubscriptionPlans = (state) =>
  state.subscriptionPlan?.plans ?? [];

export const selectSubscriptionPlan = (state) =>
  state.subscriptionPlan?.selectedPlan ?? null;

export const selectSubscriptionPlanStatus = (state) =>
  state.subscriptionPlan?.status ?? "idle";

export const selectSubscriptionPlanError = (state) =>
  state.subscriptionPlan?.error ?? null;
