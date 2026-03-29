export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type User = {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  credits: number;
  createdAt: string;
  updatedAt: string;
};
