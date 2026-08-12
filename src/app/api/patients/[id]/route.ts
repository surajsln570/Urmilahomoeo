import { NextResponse } from "next/server";
import { getPatientById, updatePatient, deletePatient } from "@/actions/patient.actions";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  return NextResponse.json(await getPatientById(Number(id)));
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const result = await updatePatient(Number(id), await req.json());
  return NextResponse.json(result, { status: result.success ? 200 : 422 });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const result = await deletePatient(Number(id));
  return NextResponse.json(result);
}
