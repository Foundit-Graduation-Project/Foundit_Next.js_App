export const authApi = {
  login: (data: any) => Promise.resolve({ data: {} }),
  logout: () => Promise.resolve({ success: true }),
  getMe: () => Promise.resolve({ data: {} }),
};
