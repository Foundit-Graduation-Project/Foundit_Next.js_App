import api from "./axios";

export const communitiesApi = {
  getCommunities: async () => {
    const response = await api.get("/admin/communities");
    return response.data;
  },
  createCommunity: async (data: any) => {
    const response = await api.post("/admin/communities", data);
    return response.data;
  },
  toggleCommunityStatus: async (id: string, status: string) => {
    const response = await api.patch(`/admin/communities/${id}/status`, { subscriptionStatus: status });
    return response.data;
  },
};
