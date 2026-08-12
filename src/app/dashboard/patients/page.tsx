import { getAllPatients } from "@/actions/patient.actions";
import { PatientsManager } from "@/components/dashboard/patients-manager";

// Converted from PatientController::index()
export default async function PatientsPage() {
  const patients = await getAllPatients();
  return <PatientsManager initialPatients={patients} />;
}
