import { NextResponse } from "next/server";
import { getPatientById, updatePatient, deletePatient } from "@/actions/patient.actions";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json(await getPatientById(Number(params.id)));
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const result = await updatePatient(Number(params.id), await req.json());
  return NextResponse.json(result, { status: result.success ? 200 : 422 });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const result = await deletePatient(Number(params.id));
  return NextResponse.json(result);
}
