import { z } from "zod";

// From app/modules/auth/requests/LoginRequest.php
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

// From app/modules/auth/requests/RegisterRequest.php
export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  mobile: z.string().min(1, "Mobile is required").max(12),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type RegisterInput = z.infer<typeof registerSchema>;
