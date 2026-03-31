import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Message cannot be empty"),
});

export type MessageFormData = z.infer<typeof messageSchema>;
