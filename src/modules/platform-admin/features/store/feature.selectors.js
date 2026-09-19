const EMPTY_ARRAY = [];

export const selectFeatures = (state) => state.feature?.features ?? EMPTY_ARRAY;

export const selectFeature = (state) => state.feature?.selectedFeature ?? null;

export const selectFeatureStatus = (state) => state.feature?.status ?? "idle";

export const selectFeatureError = (state) => state.feature?.error ?? null;
