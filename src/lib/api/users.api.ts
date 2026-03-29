export const usersApi = {
  getUsers: () => Promise.resolve({ data: [] }),
  getUser: (id: string) => Promise.resolve({ data: {} }),
  updateUser: (id: string, data: any) => Promise.resolve({ data: {} }),
};
