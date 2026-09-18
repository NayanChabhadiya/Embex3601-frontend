// =============================================================================
// EMBEX360 ERP
// Feature Selectors
// =============================================================================

const selectFeatureState = (state) =>
  state.features ?? {
    features: [],
    meta: null,

    status: "idle",
    error: null,

    currentRequestId: null,

    createStatus: "idle",
    createError: null,

    selectedFeature: null,
    selectedFeatureStatus: "idle",
    selectedFeatureError: null,

    updateStatus: "idle",
    updateError: null,

    activateStatus: "idle",
    activateError: null,

    deactivateStatus: "idle",
    deactivateError: null,

    deleteStatus: "idle",
    deleteError: null,

    restoreStatus: "idle",
    restoreError: null,
  };

// =============================================================================
// GET ALL
// =============================================================================

export const selectFeatures = (state) => selectFeatureState(state).features;

export const selectFeaturesMeta = (state) => selectFeatureState(state).meta;

export const selectFeaturesStatus = (state) => selectFeatureState(state).status;

export const selectFeaturesError = (state) => selectFeatureState(state).error;

export const selectFeaturesLoading = (state) =>
  selectFeatureState(state).status === "loading";

export const selectFeaturesLoaded = (state) =>
  selectFeatureState(state).status === "succeeded";

// =============================================================================
// CREATE
// =============================================================================

export const selectFeaturesCreateStatus = (state) =>
  selectFeatureState(state).createStatus;

export const selectFeaturesCreateError = (state) =>
  selectFeatureState(state).createError;

export const selectFeaturesCreating = (state) =>
  selectFeatureState(state).createStatus === "loading";

// =============================================================================
// GET BY ID
// =============================================================================

export const selectSelectedFeature = (state) =>
  selectFeatureState(state).selectedFeature;

export const selectSelectedFeatureStatus = (state) =>
  selectFeatureState(state).selectedFeatureStatus;

export const selectSelectedFeatureError = (state) =>
  selectFeatureState(state).selectedFeatureError;

export const selectSelectedFeatureLoading = (state) =>
  selectFeatureState(state).selectedFeatureStatus === "loading";

// =============================================================================
// UPDATE
// =============================================================================

export const selectFeaturesUpdateStatus = (state) =>
  selectFeatureState(state).updateStatus;

export const selectFeaturesUpdateError = (state) =>
  selectFeatureState(state).updateError;

export const selectFeaturesUpdating = (state) =>
  selectFeatureState(state).updateStatus === "loading";

// =============================================================================
// ACTIVATE
// =============================================================================

export const selectFeaturesActivateStatus = (state) =>
  selectFeatureState(state).activateStatus;

export const selectFeaturesActivateError = (state) =>
  selectFeatureState(state).activateError;

export const selectFeaturesActivating = (state) =>
  selectFeatureState(state).activateStatus === "loading";

// =============================================================================
// DEACTIVATE
// =============================================================================

export const selectFeaturesDeactivateStatus = (state) =>
  selectFeatureState(state).deactivateStatus;

export const selectFeaturesDeactivateError = (state) =>
  selectFeatureState(state).deactivateError;

export const selectFeaturesDeactivating = (state) =>
  selectFeatureState(state).deactivateStatus === "loading";

// =============================================================================
// DELETE
// =============================================================================

export const selectFeaturesDeleteStatus = (state) =>
  selectFeatureState(state).deleteStatus;

export const selectFeaturesDeleteError = (state) =>
  selectFeatureState(state).deleteError;

export const selectFeaturesDeleting = (state) =>
  selectFeatureState(state).deleteStatus === "loading";

// =============================================================================
// RESTORE
// =============================================================================

export const selectFeaturesRestoreStatus = (state) =>
  selectFeatureState(state).restoreStatus;

export const selectFeaturesRestoreError = (state) =>
  selectFeatureState(state).restoreError;

export const selectFeaturesRestoring = (state) =>
  selectFeatureState(state).restoreStatus === "loading";
