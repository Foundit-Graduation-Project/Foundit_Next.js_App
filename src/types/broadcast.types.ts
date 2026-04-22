export type BroadcastCategory = "ALERT" | "SYSTEM" | "MATCH" | "MESSAGE";

export type BroadcastFormData = {
  category: BroadcastCategory;
  title: string;
  message: string;
};

export type Broadcast = {
  title: string;
  message: string;
  category: BroadcastCategory;
  sentAt: string;
  recipientCount: number;
};

export type SendBroadcastResponse = {
  sent: number;
  failed: number;
  total: number;
  message: string;
};
