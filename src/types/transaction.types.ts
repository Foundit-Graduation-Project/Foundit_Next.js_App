export type TransactionType = "CREDIT_PURCHASE" | "COMMUNITY_JOIN" | "WITHDRAWAL";

export type Transaction = {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  status: "COMPLETED" | "FAILED" | "PENDING";
  createdAt: string;
};
