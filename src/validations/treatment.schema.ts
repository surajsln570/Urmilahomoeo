import { z } from "zod";

// From app/modules/treatment/requests/TreatmentRequest.php
export const treatmentSchema = z.object({
  disease: z.string().min(1, "Disease is required").max(20),
  description: z.string().min(1, "Description is required"),
  symptoms: z.string().min(1, "Symptoms are required"),
});
export type TreatmentInput = z.infer<typeof treatmentSchema>;
