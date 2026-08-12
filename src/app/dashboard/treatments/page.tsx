import { getAllTreatments } from "@/actions/treatment.actions";
import { TreatmentsManager } from "@/components/dashboard/treatments-manager";

// Converted from TreatmentController::show()
export default async function TreatmentsPage() {
  const treatments = await getAllTreatments();
  return <TreatmentsManager initialTreatments={treatments} />;
}
