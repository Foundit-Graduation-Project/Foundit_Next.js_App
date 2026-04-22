export type CommunityStatus = "ACTIVE" | "ARCHIVED";

export type Community = {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  status: CommunityStatus;
  ownerId: string;
  createdAt: string;
};
