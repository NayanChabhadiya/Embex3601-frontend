/**
 * =============================================================================
 * EMBEX360 ERP
 * Feature Selectors
 * =============================================================================
 *
 * Centralized selectors for the Feature Redux state.
 *
 * Supported operations:
 * - Fetch Features
 * - Get Feature By ID
 * - Create Feature
 * - Update Feature
 * - Activate Feature
 * - Deactivate Feature
 * - Delete Feature
 * - Restore Feature
 * =============================================================================
 */

/**
 * =============================================================================
 * Feature State
 * =============================================================================
 */

const selectFeatureState = (state) =>
  state.features ?? {
    features: [],
    meta: null,

    listStatus: "idle",
    listError: null,
    listRequestId: null,

    selectedFeature: null,

    getByIdStatus: "idle",
    getByIdError: null,
    getByIdRequestId: null,

    createStatus: "idle",
    createError: null,

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

/**
 * =============================================================================
 * List Selectors
 * =============================================================================
 */

export const selectFeatures = (state) => selectFeatureState(state).features;

export const selectFeaturesMeta = (state) => selectFeatureState(state).meta;

export const selectFeaturesStatus = (state) =>
  selectFeatureState(state).listStatus;

export const selectFeaturesError = (state) =>
  selectFeatureState(state).listError;

/**
 * =============================================================================
 * Selected Feature Selectors
 * =============================================================================
 */

export const selectSelectedFeature = (state) =>
  selectFeatureState(state).selectedFeature;

export const selectFeatureByIdStatus = (state) =>
  selectFeatureState(state).getByIdStatus;

export const selectFeatureByIdError = (state) =>
  selectFeatureState(state).getByIdError;

/**
 * =============================================================================
 * Create Selectors
 * =============================================================================
 */

export const selectFeaturesCreateStatus = (state) =>
  selectFeatureState(state).createStatus;

export const selectFeaturesCreateError = (state) =>
  selectFeatureState(state).createError;

/**
 * =============================================================================
 * Update Selectors
 * =============================================================================
 */

export const selectFeaturesUpdateStatus = (state) =>
  selectFeatureState(state).updateStatus;

export const selectFeaturesUpdateError = (state) =>
  selectFeatureState(state).updateError;

/**
 * =============================================================================
 * Activate Selectors
 * =============================================================================
 */

export const selectFeaturesActivateStatus = (state) =>
  selectFeatureState(state).activateStatus;

export const selectFeaturesActivateError = (state) =>
  selectFeatureState(state).activateError;

/**
 * =============================================================================
 * Deactivate Selectors
 * =============================================================================
 */

export const selectFeaturesDeactivateStatus = (state) =>
  selectFeatureState(state).deactivateStatus;

export const selectFeaturesDeactivateError = (state) =>
  selectFeatureState(state).deactivateError;

/**
 * =============================================================================
 * Delete Selectors
 * =============================================================================
 */

export const selectFeaturesDeleteStatus = (state) =>
  selectFeatureState(state).deleteStatus;

export const selectFeaturesDeleteError = (state) =>
  selectFeatureState(state).deleteError;

/**
 * =============================================================================
 * Restore Selectors
 * =============================================================================
 */

export const selectFeaturesRestoreStatus = (state) =>
  selectFeatureState(state).restoreStatus;

export const selectFeaturesRestoreError = (state) =>
  selectFeatureState(state).restoreError;
