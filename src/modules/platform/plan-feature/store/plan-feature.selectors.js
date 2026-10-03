// =============================================================================
// Plan Feature Selectors
// =============================================================================

export const selectPlanFeatures = (state) =>
  state.planFeature?.planFeatures || [];

export const selectPlanFeaturePagination = (state) =>
  state.planFeature?.pagination || {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };

export const selectPlanFeatureListLoading = (state) =>
  state.planFeature?.listLoading || false;

export const selectPlanFeatureListError = (state) =>
  state.planFeature?.listError || null;

export const selectCreatedPlanFeature = (state) =>
  state.planFeature?.createdPlanFeature || null;

export const selectCreatePlanFeatureLoading = (state) =>
  state.planFeature?.createLoading || false;

export const selectCreatePlanFeatureError = (state) =>
  state.planFeature?.createError || null;
