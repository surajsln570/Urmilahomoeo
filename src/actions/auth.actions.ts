"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema, type RegisterInput } from "@/validations/auth.schema";

/**
 * Converted from app/modules/auth/services/AuthService.php::register()
 * New self-registered users always get role_id 4 ("Patient"), matching the
 * original Laravel behavior.
 */
export async function registerUser(input: RegisterInput) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message ?? "Invalid data" };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { success: false, message: "email already exist" };
  }

  const patientRole = await prisma.role.findUnique({ where: { name: "Patient" } });
  if (!patientRole) {
    return { success: false, message: "Patient role is not seeded. Run the database seed first." };
  }

  const hashed = await bcrypt.hash(parsed.data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      mobile: parsed.data.mobile,
      email: parsed.data.email,
      password: hashed,
      roleId: patientRole.id,
    },
  });

  return { success: true, message: "user registered successfully", userId: user.id };
}
