import { z } from "zod";

export const broadcastSchema = z.object({
  category: z.enum(["ALERT", "SYSTEM", "MATCH", "MESSAGE"]as const,
  { error: "Please select a valid category" }),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must be less than 500 characters"),
});

export type BroadcastFormValues = z.infer<typeof broadcastSchema>;
