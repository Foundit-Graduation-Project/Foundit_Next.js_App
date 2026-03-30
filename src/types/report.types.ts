import { User } from "./user.types";

export type ReportStatus = "OPEN" | "REJECTED" | "MATCHED" | "RESOLVED";
export type Report = {
  id: string;
  title: string;
  description: string;
  status: ReportStatus;
  reporterId: string;
  targetId: string;
  createdAt: string;

  images: string[];
  category: string;
  locationName: string;
  location: string;
  type: string;
  user: User;
};

export type ReportStats = {
  OPEN: number;
  REJECTED: number;
  MATCHED: number;
  RESOLVED: number;
  total: number;
};

// used in slice
export type ReportsState = {
  items: Report[];
  stats: ReportStats;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
};