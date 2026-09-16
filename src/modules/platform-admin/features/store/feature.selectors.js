const selectFeatureState = (state) =>
  state.features ?? {
    features: [],
    meta: null,
    status: "idle",
    error: null,
  };

export const selectFeatures = (state) => selectFeatureState(state).features;

export const selectFeaturesMeta = (state) => selectFeatureState(state).meta;

export const selectFeaturesStatus = (state) => selectFeatureState(state).status;

export const selectFeaturesError = (state) => selectFeatureState(state).error;
