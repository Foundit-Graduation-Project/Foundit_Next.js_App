import { z } from "zod";

// ['OPEN', 'REJECTED', 'MATCHED', 'RESOLVED']
export const reportStatusSchema = z.enum(["OPEN", "REJECTED", "MATCHED", "RESOLVED"]).describe(`The current status ${z.enum(["OPEN", "REJECTED", "MATCHED", "RESOLVED"])} of the safety report`);

export const updateReportStatusSchema = z.object({
  status: reportStatusSchema,
});

export const reportFilterSchema = z.object({
  status: reportStatusSchema.optional(),
  type: z.enum(["LOST", "FOUND"]).optional(),
  category: z.enum(["Electronics", "Accessories"]).optional(),
});

export type UpdateReportStatusInput = z.infer<typeof updateReportStatusSchema>;