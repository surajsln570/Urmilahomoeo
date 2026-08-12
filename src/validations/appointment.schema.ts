import { z } from "zod";

// From app/modules/appointment/requests/AppointmentRequest.php
export const appointmentSchema = z.object({
  patientName: z.string().min(1, "Name is required").max(255),
  patientMobile: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  date: z.string().min(1, "Date is required"),
  timeSlotId: z.coerce.number().int().positive("Please select a time slot"),
  mode: z.enum(["online", "offline"]).default("offline"),
  meetingLink: z.string().url().optional().or(z.literal("")).optional(),
});
export type AppointmentInput = z.infer<typeof appointmentSchema>;

// From app/modules/appointment/requests/UpdateAppointmentRequest.php
export const updateAppointmentSchema = z.object({
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
});
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
