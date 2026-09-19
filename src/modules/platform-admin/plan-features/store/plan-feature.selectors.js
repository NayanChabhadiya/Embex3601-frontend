export const selectPlanFeatures = (state) =>
  state.planFeature?.planFeatures ?? [];

export const selectPlanFeature = (state) =>
  state.planFeature?.selectedPlanFeature ?? null;

export const selectPlanFeatureStatus = (state) =>
  state.planFeature?.status ?? "idle";

export const selectPlanFeatureError = (state) =>
  state.planFeature?.error ?? null;
