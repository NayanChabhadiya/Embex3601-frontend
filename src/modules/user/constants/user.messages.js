// --------------------------------------------------------------------------
// User Messages
// --------------------------------------------------------------------------

const USER_MESSAGES = Object.freeze({
  // ------------------------------------------------------------------------
  // Create User
  // ------------------------------------------------------------------------

  CREATE_SUCCESS: "User created successfully.",
  CREATE_ERROR: "Failed to create user.",

  // ------------------------------------------------------------------------
  // Fetch Users
  // ------------------------------------------------------------------------

  FETCH_SUCCESS: "Users fetched successfully.",
  FETCH_ERROR: "Failed to fetch users.",

  // ------------------------------------------------------------------------
  // Fetch User By ID
  // ------------------------------------------------------------------------

  FETCH_BY_ID_SUCCESS: "User fetched successfully.",
  FETCH_BY_ID_ERROR: "Failed to fetch user.",

  // ------------------------------------------------------------------------
  // Update User
  // ------------------------------------------------------------------------

  UPDATE_SUCCESS: "User updated successfully.",
  UPDATE_ERROR: "Failed to update user.",

  // ------------------------------------------------------------------------
  // Delete User
  // ------------------------------------------------------------------------

  DELETE_SUCCESS: "User deleted successfully.",
  DELETE_ERROR: "Failed to delete user.",

  // ------------------------------------------------------------------------
  // Validation
  // ------------------------------------------------------------------------

  FIRST_NAME_REQUIRED: "First name is required.",
  LAST_NAME_REQUIRED: "Last name is required.",
  EMAIL_REQUIRED: "Email is required.",
  PASSWORD_REQUIRED: "Password is required.",
  USER_TYPE_REQUIRED: "User type is required.",

  INVALID_EMAIL: "Please enter a valid email address.",
  INVALID_MOBILE: "Please enter a valid mobile number.",
  INVALID_USER_TYPE: "Please select a valid user type.",
  INVALID_USER_STATUS: "Please select a valid user status.",
  INVALID_VERIFICATION_STATUS: "Please select a valid verification status.",

  // ------------------------------------------------------------------------
  // Common
  // ------------------------------------------------------------------------

  REQUIRED_FIELD: "This field is required.",
  SOMETHING_WENT_WRONG: "Something went wrong. Please try again.",
});

export default USER_MESSAGES;
