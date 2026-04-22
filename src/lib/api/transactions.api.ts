import api from "./axios";

export const transactionsApi = {
  getTransactions: async (page = 1, limit = 10) => {
    const response = await api.get(`/admin/transactions?page=${page}&limit=${limit}`);
    return response.data;
  },
  getTransactionStats: async () => {
    const response = await api.get("/admin/transactions/stats");
    return response.data;
  },
};
