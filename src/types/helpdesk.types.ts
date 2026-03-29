export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export type Ticket = {
  id: string;
  userId: string;
  subject: string;
  lastMessage: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
};
