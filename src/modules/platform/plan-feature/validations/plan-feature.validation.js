// =============================================================================
// Plan Feature Validation
// =============================================================================

import { PLAN_FEATURE_STATUS } from "../constants/plan-feature.constants.js";
import PLAN_FEATURE_MESSAGES from "../constants/plan-feature.messages.js";

// =============================================================================
// Helpers
// =============================================================================

const isValidObjectId = (value) => {
  return /^[a-fA-F0-9]{24}$/.test(String(value || ""));
};

// =============================================================================
// Create Plan Feature
// =============================================================================

const validateCreatePlanFeature = (data = {}) => {
  const errors = {};

  // ---------------------------------------------------------------------------
  // Plan ID
  // ---------------------------------------------------------------------------

  if (!data.planId) {
    errors.planId = PLAN_FEATURE_MESSAGES.PLAN_ID_REQUIRED;
  } else if (!isValidObjectId(data.planId)) {
    errors.planId = PLAN_FEATURE_MESSAGES.INVALID_PLAN_ID;
  }

  // ---------------------------------------------------------------------------
  // Feature ID
  // ---------------------------------------------------------------------------

  if (!data.featureId) {
    errors.featureId = PLAN_FEATURE_MESSAGES.FEATURE_ID_REQUIRED;
  } else if (!isValidObjectId(data.featureId)) {
    errors.featureId = PLAN_FEATURE_MESSAGES.INVALID_FEATURE_ID;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// =============================================================================
// List Plan Features
// =============================================================================

const validatePlanFeatureList = (params = {}) => {
  const errors = {};

  // ---------------------------------------------------------------------------
  // Page
  // ---------------------------------------------------------------------------

  if (
    params.page !== undefined &&
    (!Number.isInteger(Number(params.page)) || Number(params.page) < 1)
  ) {
    errors.page = "Page must be a positive integer.";
  }

  // ---------------------------------------------------------------------------
  // Limit
  // ---------------------------------------------------------------------------

  if (
    params.limit !== undefined &&
    (!Number.isInteger(Number(params.limit)) ||
      Number(params.limit) < 1 ||
      Number(params.limit) > 100)
  ) {
    errors.limit = "Limit must be between 1 and 100.";
  }

  // ---------------------------------------------------------------------------
  // Plan ID
  // ---------------------------------------------------------------------------

  if (params.planId && !isValidObjectId(params.planId)) {
    errors.planId = PLAN_FEATURE_MESSAGES.INVALID_PLAN_ID;
  }

  // ---------------------------------------------------------------------------
  // Feature ID
  // ---------------------------------------------------------------------------

  if (params.featureId && !isValidObjectId(params.featureId)) {
    errors.featureId = PLAN_FEATURE_MESSAGES.INVALID_FEATURE_ID;
  }

  // ---------------------------------------------------------------------------
  // Status
  // ---------------------------------------------------------------------------

  if (
    params.status &&
    !Object.values(PLAN_FEATURE_STATUS).includes(params.status)
  ) {
    errors.status = PLAN_FEATURE_MESSAGES.INVALID_STATUS;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// =============================================================================
// Export
// =============================================================================

export { validateCreatePlanFeature, validatePlanFeatureList };
