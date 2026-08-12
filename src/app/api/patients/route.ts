import { NextResponse } from "next/server";
import { getAllPatients, createPatient } from "@/actions/patient.actions";

export async function GET() {
  return NextResponse.json(await getAllPatients());
}

export async function POST(req: Request) {
  const result = await createPatient(await req.json());
  return NextResponse.json(result, { status: result.success ? 201 : 422 });
}
