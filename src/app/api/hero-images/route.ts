import { NextResponse } from "next/server";
import { getAllHeroImages, uploadHeroImage } from "@/actions/hero-image.actions";

export async function GET() {
  return NextResponse.json(await getAllHeroImages());
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const result = await uploadHeroImage(formData);
  return NextResponse.json(result, { status: result.success ? 201 : 422 });
}
