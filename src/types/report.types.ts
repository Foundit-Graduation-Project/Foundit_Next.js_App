export type ReportStatus = "PENDING" | "RESOLVED" | "DISMISSED";

export type Report = {
  id: string;
  title: string;
  description: string;
  status: ReportStatus;
  reporterId: string;
  targetId: string;
  createdAt: string;
};
