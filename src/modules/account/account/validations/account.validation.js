// =============================================================================
// Account Validation
// =============================================================================

import Joi from "joi";

import {
  ACCOUNT_TYPES,
  ACCOUNT_LIMITS,
} from "../constants/account.constants.js";

import ACCOUNT_MESSAGES from "../constants/account.messages.js";

// =============================================================================
// Common Validation Rules
// =============================================================================

const accountName = Joi.string()
  .trim()
  .min(ACCOUNT_LIMITS.MIN_NAME_LENGTH)
  .max(ACCOUNT_LIMITS.MAX_NAME_LENGTH);

const accountCode = Joi.string()
  .trim()
  .uppercase()
  .min(ACCOUNT_LIMITS.MIN_CODE_LENGTH)
  .max(ACCOUNT_LIMITS.MAX_CODE_LENGTH)
  .pattern(/^[A-Z0-9_-]+$/);

// =============================================================================
// Create Account
// =============================================================================

const createAccountSchema = Joi.object({
  name: accountName.required().messages({
    "any.required": ACCOUNT_MESSAGES.NAME_REQUIRED,
    "string.empty": ACCOUNT_MESSAGES.NAME_REQUIRED,
    "string.min": "Account name is too short.",
    "string.max": "Account name is too long.",
  }),

  code: accountCode.required().messages({
    "any.required": ACCOUNT_MESSAGES.CODE_REQUIRED,
    "string.empty": ACCOUNT_MESSAGES.CODE_REQUIRED,
    "string.min": "Account code is too short.",
    "string.max": "Account code is too long.",
    "string.pattern.base": "Account code contains invalid characters.",
  }),

  type: Joi.string()
    .valid(...Object.values(ACCOUNT_TYPES))
    .required()
    .messages({
      "any.required": ACCOUNT_MESSAGES.INVALID_TYPE,
      "any.only": ACCOUNT_MESSAGES.INVALID_TYPE,
    }),

  // ---------------------------------------------------------------------------
  // Server-Controlled Fields
  // ---------------------------------------------------------------------------

  accountId: Joi.forbidden(),
  ownerId: Joi.forbidden(),
  status: Joi.forbidden(),
  subscriptionPlanId: Joi.forbidden(),
  createdBy: Joi.forbidden(),
  updatedBy: Joi.forbidden(),
  isDeleted: Joi.forbidden(),
  deletedAt: Joi.forbidden(),
  deletedBy: Joi.forbidden(),
});

// =============================================================================
// List Accounts
// =============================================================================

const listAccountsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(ACCOUNT_LIMITS.MAX_LIST_LIMIT)
    .default(20),

  search: Joi.string()
    .trim()
    .max(100)
    .allow("")
    .optional(),

  type: Joi.string()
    .valid(...Object.values(ACCOUNT_TYPES))
    .optional()
    .messages({
      "any.only": ACCOUNT_MESSAGES.INVALID_TYPE,
    }),

  status: Joi.string()
    .valid("active", "inactive", "suspended")
    .optional()
    .messages({
      "any.only": ACCOUNT_MESSAGES.INVALID_STATUS,
    }),
});

// =============================================================================
// Export
// =============================================================================

const accountValidation = Object.freeze({
  createAccountSchema,
  listAccountsSchema,
});

export default accountValidation;