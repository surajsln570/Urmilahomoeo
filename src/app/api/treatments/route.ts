import { NextResponse } from "next/server";
import { getAllTreatments, createTreatment } from "@/actions/treatment.actions";

export async function GET() {
  return NextResponse.json(await getAllTreatments());
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const result = await createTreatment(formData);
  return NextResponse.json(result, { status: result.success ? 201 : 422 });
}
