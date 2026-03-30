import * as z from "zod";

// at least 8 chars, one letter, one number, allows special characters
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string()
      .min(8, "New password must be at least 8 characters")
      .regex(passwordRegex, "Password must contain at least one letter and one number"),
    confirmNewPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  });

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
