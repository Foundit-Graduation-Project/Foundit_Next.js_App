export const helpdeskApi = {
  getTickets: () => Promise.resolve({ data: [] }),
  getTicket: (id: string) => Promise.resolve({ data: {} }),
  sendMessage: (id: string, data: any) => Promise.resolve({ data: {} }),
};
