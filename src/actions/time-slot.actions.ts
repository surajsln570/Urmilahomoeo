"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { timeSlotSchema, type TimeSlotInput } from "@/validations/time-slot.schema";

// Converted from app/modules/appointment/service/TimeSlotService.php

export async function getAllTimeSlots() {
  return prisma.timeSlot.findMany({ orderBy: [{ day: "asc" }, { startTime: "asc" }] });
}

export async function getTimeSlotById(id: number) {
  return prisma.timeSlot.findUniqueOrThrow({ where: { id } });
}

async function ensureNoOverlap(data: TimeSlotInput, excludeId?: number) {
  const overlap = await prisma.timeSlot.findFirst({
    where: {
      day: data.day,
      startTime: { lt: data.endTime },
      endTime: { gt: data.startTime },
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
  });
  return !!overlap;
}

export async function createTimeSlot(input: TimeSlotInput) {
  const parsed = timeSlotSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message ?? "Invalid data" };
  }

  if (await ensureNoOverlap(parsed.data)) {
    return {
      success: false,
      message: "A time slot already exists that overlaps with this time on the selected day.",
    };
  }

  const slot = await prisma.timeSlot.create({ data: parsed.data });
  revalidatePath("/dashboard/time-slots");
  return { success: true, message: "Time slot created successfully.", data: slot };
}

export async function updateTimeSlot(id: number, input: TimeSlotInput) {
  const parsed = timeSlotSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message ?? "Invalid data" };
  }

  if (await ensureNoOverlap(parsed.data, id)) {
    return {
      success: false,
      message: "A time slot already exists that overlaps with this time on the selected day.",
    };
  }

  const slot = await prisma.timeSlot.update({ where: { id }, data: parsed.data });
  revalidatePath("/dashboard/time-slots");
  return { success: true, message: "Time slot updated successfully.", data: slot };
}

export async function deleteTimeSlot(id: number) {
  await prisma.timeSlot.delete({ where: { id } });
  revalidatePath("/dashboard/time-slots");
  return { success: true, message: "Time slot deleted successfully." };
}
