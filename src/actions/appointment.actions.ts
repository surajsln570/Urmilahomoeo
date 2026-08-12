"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { appointmentSchema, updateAppointmentSchema, type AppointmentInput } from "@/validations/appointment.schema";
import { weekdayFromDate, formatTime } from "@/lib/utils";

// Converted from app/modules/appointment/service/AppointmentService.php

export async function getAllAppointments() {
  return prisma.appointment.findMany({
    include: { timeSlot: true },
    orderBy: { createdAt: "desc" },
  });
}

function hoursBetween(start: string, end: string) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return (eh * 60 + em - (sh * 60 + sm)) / 60;
}

/**
 * Mirrors AppointmentService::getAvailableSlots(): finds time slots configured
 * for the given date's weekday, then filters out any slot that has already
 * reached capacity (10 appointments per hour of slot duration) for that date.
 */
export async function getAvailableSlots(date: string) {
  const dayName = weekdayFromDate(date);

  const daySlots = await prisma.timeSlot.findMany({
    where: { day: dayName as never, status: true },
    orderBy: { startTime: "asc" },
  });

  const results = [];
  for (const slot of daySlots) {
    const appointmentCount = await prisma.appointment.count({
      where: { timeSlotId: slot.id, date: new Date(date) },
    });
    const hours = hoursBetween(slot.startTime, slot.endTime);
    if (appointmentCount < 10 * hours) {
      results.push({
        id: slot.id,
        label: `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`,
      });
    }
  }
  return results;
}

export async function bookAppointment(input: AppointmentInput) {
  const parsed = appointmentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message ?? "Invalid data" };
  }

  const slot = await prisma.timeSlot.findUnique({ where: { id: parsed.data.timeSlotId } });
  if (!slot || !slot.status) {
    return { success: false, message: "Selected slot is no longer available." };
  }

  const requestedDay = weekdayFromDate(parsed.data.date);
  if (slot.day !== requestedDay) {
    return { success: false, message: "Selected slot is not valid for this date. Please reselect." };
  }

  try {
    const appointment = await prisma.appointment.create({
      data: {
        patientName: parsed.data.patientName,
        patientMobile: parsed.data.patientMobile,
        date: new Date(parsed.data.date),
        timeSlotId: parsed.data.timeSlotId,
        mode: parsed.data.mode,
        meetingLink: parsed.data.meetingLink || null,
        status: "pending",
      },
      include: { timeSlot: true },
    });

    revalidatePath("/dashboard/appointments");
    return { success: true, message: "Appointment booked successfully!", data: appointment };
  } catch {
    return { success: false, message: "This slot has just been booked. Please choose another." };
  }
}

export async function updateAppointmentStatus(id: number, status: string) {
  const parsed = updateAppointmentSchema.safeParse({ status });
  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message ?? "Invalid status" };
  }

  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  revalidatePath("/dashboard/appointments");
  return { success: true, message: "Appointment updated successfully.", data: appointment };
}

export async function deleteAppointment(id: number) {
  const appointment = await prisma.appointment.findUniqueOrThrow({ where: { id } });
  if (appointment.status === "completed") {
    return { success: false, message: "Completed appointments cannot be deleted." };
  }

  await prisma.appointment.delete({ where: { id } });
  revalidatePath("/dashboard/appointments");
  return { success: true, message: "Appointment deleted successfully." };
}
