"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { patientSchema, type PatientInput } from "@/validations/patient.schema";

// Converted from app/modules/patient/services/PatientService.php

export async function getAllPatients() {
  return prisma.patient.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getPatientById(id: number) {
  return prisma.patient.findUniqueOrThrow({ where: { id } });
}

export async function createPatient(input: PatientInput) {
  const parsed = patientSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message ?? "Invalid data" };
  }

  const dup = await prisma.patient.findUnique({ where: { registrationNumber: parsed.data.registrationNumber } });
  if (dup) return { success: false, message: "Registration number already exists." };

  const patient = await prisma.patient.create({ data: parsed.data });
  revalidatePath("/dashboard/patients");
  return { success: true, message: "Patient created successfully.", data: patient };
}

export async function updatePatient(id: number, input: PatientInput) {
  const parsed = patientSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message ?? "Invalid data" };
  }

  const dup = await prisma.patient.findFirst({
    where: { registrationNumber: parsed.data.registrationNumber, NOT: { id } },
  });
  if (dup) return { success: false, message: "Registration number already exists." };

  const patient = await prisma.patient.update({ where: { id }, data: parsed.data });
  revalidatePath("/dashboard/patients");
  return { success: true, message: "Patient updated successfully.", data: patient };
}

export async function deletePatient(id: number) {
  await prisma.patient.delete({ where: { id } });
  revalidatePath("/dashboard/patients");
  return { success: true, message: "Patient deleted successfully." };
}
