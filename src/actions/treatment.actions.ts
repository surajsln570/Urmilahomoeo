"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { treatmentSchema } from "@/validations/treatment.schema";
import { saveUploadedFile, deleteUploadedFile, validateImage } from "@/lib/upload";

// Converted from app/modules/treatment/services/TreatmentServices.php

export async function getAllTreatments() {
  return prisma.treatment.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createTreatment(formData: FormData) {
  const parsed = treatmentSchema.safeParse({
    disease: formData.get("disease"),
    description: formData.get("description"),
    symptoms: formData.get("symptoms"),
  });
  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message ?? "Invalid data" };
  }

  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) return { success: false, message: "Image is required." };
  const imgError = validateImage(file);
  if (imgError) return { success: false, message: imgError };

  const imagePath = await saveUploadedFile(file, "treatments");

  const treatment = await prisma.treatment.create({
    data: { ...parsed.data, image: imagePath },
  });

  revalidatePath("/dashboard/treatments");
  revalidatePath("/");
  return { success: true, message: "Treatment created successfully.", data: treatment };
}

export async function updateTreatment(id: number, formData: FormData) {
  const parsed = treatmentSchema.safeParse({
    disease: formData.get("disease"),
    description: formData.get("description"),
    symptoms: formData.get("symptoms"),
  });
  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message ?? "Invalid data" };
  }

  const treatment = await prisma.treatment.findUniqueOrThrow({ where: { id } });

  let imagePath = treatment.image;
  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    const imgError = validateImage(file);
    if (imgError) return { success: false, message: imgError };
    await deleteUploadedFile(treatment.image);
    imagePath = await saveUploadedFile(file, "treatments");
  }

  const updated = await prisma.treatment.update({
    where: { id },
    data: { ...parsed.data, image: imagePath },
  });

  revalidatePath("/dashboard/treatments");
  revalidatePath("/");
  return { success: true, message: "Treatment updated successfully.", data: updated };
}

export async function deleteTreatment(id: number) {
  const treatment = await prisma.treatment.findUniqueOrThrow({ where: { id } });
  await deleteUploadedFile(treatment.image);
  await prisma.treatment.delete({ where: { id } });

  revalidatePath("/dashboard/treatments");
  revalidatePath("/");
  return { success: true, message: "Treatment deleted successfully" };
}
