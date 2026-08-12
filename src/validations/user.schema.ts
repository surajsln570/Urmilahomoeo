import { z } from "zod";

// From app/modules/user/requests/StoreUserRequest.php / UpdateUserRequest.php
export const userSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  mobile: z.string().min(1, "Mobile is required").max(12),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type UserInput = z.infer<typeof userSchema>;

export const updateUserSchema = userSchema.partial({ password: true });
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
