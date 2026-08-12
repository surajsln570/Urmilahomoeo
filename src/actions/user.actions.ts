"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { userSchema, updateUserSchema, type UserInput, type UpdateUserInput } from "@/validations/user.schema";

// Converted from app/modules/user/services/UserService.php

export async function getAllUsers() {
  return prisma.user.findMany({ orderBy: { createdAt: "desc" }, include: { role: true } });
}

export async function createUser(input: UserInput) {
  const parsed = userSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message ?? "Invalid data" };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return { success: false, message: "email already exist" };

  const patientRole = await prisma.role.findUnique({ where: { name: "Patient" } });
  if (!patientRole) return { success: false, message: "Patient role is not seeded." };

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

  revalidatePath("/dashboard/users");
  return { success: true, message: "User created successfully", data: user };
}

export async function updateUser(id: number, input: UpdateUserInput) {
  const parsed = updateUserSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message ?? "Invalid data" };
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return { success: false, message: "User not found" };

  const data: Record<string, unknown> = {
    name: parsed.data.name,
    mobile: parsed.data.mobile,
    email: parsed.data.email,
  };
  if (parsed.data.password) {
    data.password = await bcrypt.hash(parsed.data.password, 10);
  }

  const updated = await prisma.user.update({ where: { id }, data });
  revalidatePath("/dashboard/users");
  return { success: true, message: "User updated successfully", data: updated };
}

export async function deleteUser(id: number) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return { success: false, message: "User not found" };

  await prisma.user.delete({ where: { id } });
  revalidatePath("/dashboard/users");
  return { success: true, message: "User deleted successfully" };
}
