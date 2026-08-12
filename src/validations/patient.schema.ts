import { z } from "zod";

// From app/modules/patient/requests/StorePatientRequest.php / UpdatePatientRequest.php
export const patientSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  age: z.coerce.number().int().min(0).max(150),
  sex: z.enum(["male", "female", "other"]),
  religion: z.enum(["hindu", "muslim", "christian", "sikh", "other"]),
  address: z.string().min(1, "Address is required"),
  remark: z.string().optional().nullable(),
  registrationNumber: z.coerce.number().int(),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  mobile: z
    .string()
    .regex(/^\d{10,15}$/, "Mobile number must be between 10 and 15 digits."),
  patientName: z.string().min(1, "Patient (guardian) name is required").max(255),
});
export type PatientInput = z.infer<typeof patientSchema>;
