export type BroadcastStatus = "SENT" | "SCHEDULED" | "DRAFT";

export type Broadcast = {
  id: string;
  title: string;
  content: string;
  status: BroadcastStatus;
  sentAt?: string;
  scheduledAt?: string;
  createdAt: string;
};
