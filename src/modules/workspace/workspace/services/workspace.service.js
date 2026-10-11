// =============================================================================
// Workspace Service
// =============================================================================

import apiClient from "../../../../services/api/apiClient.js";
import API_ENDPOINTS from "../../../../services/api/endpoints.js";

const WORKSPACE_ENDPOINT = API_ENDPOINTS.WORKSPACE;

// =============================================================================
// Create Workspace
// =============================================================================

const createWorkspace = async (data) => {
  return apiClient.post(WORKSPACE_ENDPOINT.BASE, data);
};

// =============================================================================
// Get Workspaces
// =============================================================================

const getWorkspaces = async (params = {}) => {
  return apiClient.get(WORKSPACE_ENDPOINT.BASE, {
    params,
  });
};

// =============================================================================
// Export
// =============================================================================

const workspaceService = Object.freeze({
  createWorkspace,
  getWorkspaces,
});

export default workspaceService;
