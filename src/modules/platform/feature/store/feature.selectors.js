// =============================================================================
// Feature Selectors
// =============================================================================

const selectFeatureState = (state) => state.feature;

// -----------------------------------------------------------------------------
// Features
// -----------------------------------------------------------------------------

export const selectFeatures = (state) => selectFeatureState(state).features;

// -----------------------------------------------------------------------------
// Pagination
// -----------------------------------------------------------------------------

export const selectFeaturePagination = (state) =>
  selectFeatureState(state).pagination;

// -----------------------------------------------------------------------------
// List Loading
// -----------------------------------------------------------------------------

export const selectFeatureListLoading = (state) =>
  selectFeatureState(state).listLoading;

// -----------------------------------------------------------------------------
// List Error
// -----------------------------------------------------------------------------

export const selectFeatureListError = (state) =>
  selectFeatureState(state).listError;

// -----------------------------------------------------------------------------
// Created Feature
// -----------------------------------------------------------------------------

export const selectCreatedFeature = (state) =>
  selectFeatureState(state).createdFeature;

// -----------------------------------------------------------------------------
// Create Loading
// -----------------------------------------------------------------------------

export const selectCreateFeatureLoading = (state) =>
  selectFeatureState(state).createLoading;

// -----------------------------------------------------------------------------
// Create Error
// -----------------------------------------------------------------------------

export const selectCreateFeatureError = (state) =>
  selectFeatureState(state).createError;

// -----------------------------------------------------------------------------
// Default Selectors Object
// -----------------------------------------------------------------------------

const featureSelectors = Object.freeze({
  selectFeatures,
  selectFeaturePagination,
  selectFeatureListLoading,
  selectFeatureListError,
  selectCreatedFeature,
  selectCreateFeatureLoading,
  selectCreateFeatureError,
});

export default featureSelectors;
