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
};
