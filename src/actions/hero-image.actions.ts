"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile, deleteUploadedFile, validateImage } from "@/lib/upload";

// Converted from app/modules/website/services/HeroService.php
// and app/modules/website/controllers/HeroController.php

export async function getAllHeroImages() {
  return prisma.heroImage.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getActiveHeroImages() {
  return prisma.heroImage.findMany({ where: { status: true }, orderBy: { createdAt: "desc" } });
}

export async function uploadHeroImage(formData: FormData) {
  const file = formData.get("heroImage") as File | null;
  if (!file || file.size === 0) return { success: false, message: "Hero image is required." };

  const imgError = validateImage(file);
  if (imgError) return { success: false, message: imgError };

  const imagePath = await saveUploadedFile(file, "hero");
  const heroImage = await prisma.heroImage.create({ data: { heroImage: imagePath } });

  revalidatePath("/dashboard/hero-images");
  revalidatePath("/");
  return { success: true, message: "Hero image uploaded successfully", data: heroImage };
}

export async function deleteHeroImage(id: number) {
  const heroImage = await prisma.heroImage.findUniqueOrThrow({ where: { id } });
  await deleteUploadedFile(heroImage.heroImage);
  await prisma.heroImage.delete({ where: { id } });

  revalidatePath("/dashboard/hero-images");
  revalidatePath("/");
  return { success: true, message: "Hero image deleted successfully" };
}

/**
 * Mirrors HeroController::status() — only one hero image can be "active" at a
 * time, so activating one deactivates all the others first.
 */
export async function toggleHeroImageStatus(id: number) {
  const current = await prisma.heroImage.findUniqueOrThrow({ where: { id } });

  await prisma.$transaction([
    prisma.heroImage.updateMany({ data: { status: false } }),
    prisma.heroImage.update({ where: { id }, data: { status: !current.status } }),
  ]);

  revalidatePath("/dashboard/hero-images");
  revalidatePath("/");
  return { success: true };
}
