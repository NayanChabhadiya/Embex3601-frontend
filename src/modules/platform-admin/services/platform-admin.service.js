import apiClient from "../../../services/api/apiClient";
import API_ENDPOINTS from "../../../services/api/endpoints";

const getAccess = async () => {
  return apiClient.get(API_ENDPOINTS.PLATFORM_ADMIN.ACCESS);
};

const platformAdminService = Object.freeze({
  getAccess,
});

export default platformAdminService;
