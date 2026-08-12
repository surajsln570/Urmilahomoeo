import { NextResponse } from "next/server";
import { getAllAppointments, bookAppointment } from "@/actions/appointment.actions";

export async function GET() {
  return NextResponse.json(await getAllAppointments());
}

// Converted from AppointmentController::store() (POST /appointment/store)
export async function POST(req: Request) {
  const result = await bookAppointment(await req.json());
  return NextResponse.json(result, { status: result.success ? 201 : 422 });
}
