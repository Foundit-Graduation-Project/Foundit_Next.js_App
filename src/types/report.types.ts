import { User } from "./user.types";

export type ReportStatus = "OPEN" | "REJECTED" | "MATCHED" | "RESOLVED";
export type ReportImage = {
  url: string;
  publicId: string;
};

export type ReportDetail = Report & { aiScanScore?: number };

export type Report = {
  _id: string;
  id?: string; // Mongoose virtual — not always present
  title: string;
  description: string;
  status: ReportStatus;
  reporterId?: string;
  targetId?: string;
  createdAt: string;

  images: ReportImage[];
  category: string;
  subCategory?: string;
  color?: string;
  brand?: string;
  tags?: string[];
  locationName: string;
  location?: {
    type: string;
    coordinates: number[];
  };
  dateHappened?: string;
  type: "LOST" | "FOUND";
  user: User;
};

export type ReportStats = {
  OPEN: number;
  REJECTED: number;
  MATCHED: number;
  RESOLVED: number;
  total: number;
};

export type ReportFilters = {
  keyword?: string;
  status?: ReportStatus | "";
  type?: "LOST" | "FOUND" | "";
}

// used in slice
export type ReportsState = {
  items: Report[];
  selectedReport: ReportDetail | null;
  stats: ReportStats;
  loading: boolean;
  error: string | null;
  filters: ReportFilters;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};


// Add this to your report.types.ts
export type FetchReportsPayload = {
  reports: Report[];
  total: number;
  totalPages: number;
  results: number;
};