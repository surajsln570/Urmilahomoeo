import { NextResponse } from "next/server";
import { updateAppointmentStatus, deleteAppointment } from "@/actions/appointment.actions";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { status } = await req.json();
  const id = (await params).id
  const result = await updateAppointmentStatus(Number(id), status);
  return NextResponse.json(result, { status: result.success ? 200 : 422 });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const result = await deleteAppointment(Number(id));
  return NextResponse.json(result);
}
