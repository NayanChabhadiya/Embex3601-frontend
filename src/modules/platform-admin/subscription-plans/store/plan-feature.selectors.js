const selectPlanFeatureState = (state) =>
  state.planFeatures ?? {
    features: [],
    meta: null,
    status: "idle",
    error: null,
    mutationStatus: "idle",
    mutationError: null,
  };

export const selectPlanFeatures = (state) =>
  selectPlanFeatureState(state).features;

export const selectPlanFeaturesMeta = (state) =>
  selectPlanFeatureState(state).meta;

export const selectPlanFeaturesStatus = (state) =>
  selectPlanFeatureState(state).status;

export const selectPlanFeaturesError = (state) =>
  selectPlanFeatureState(state).error;

export const selectPlanFeatureMutationStatus = (state) =>
  selectPlanFeatureState(state).mutationStatus;

export const selectPlanFeatureMutationError = (state) =>
  selectPlanFeatureState(state).mutationError;
