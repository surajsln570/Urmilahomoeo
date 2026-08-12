import { z } from "zod";

// From app/modules/appointment/requests/TimeSlotRequest.php
export const timeSlotSchema = z
  .object({
    day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
    startTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Invalid start time"),
    endTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Invalid end time"),
    status: z.coerce.boolean().default(true),
    mode: z.enum(["online", "offline", "both"]).default("both"),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });
export type TimeSlotInput = z.infer<typeof timeSlotSchema>;
