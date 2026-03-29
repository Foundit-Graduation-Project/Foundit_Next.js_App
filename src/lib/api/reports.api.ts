export const reportsApi = {
  getReports: () => Promise.resolve({ data: [] }),
  getReport: (id: string) => Promise.resolve({ data: {} }),
  updateReport: (id: string, data: any) => Promise.resolve({ data: {} }),
};
