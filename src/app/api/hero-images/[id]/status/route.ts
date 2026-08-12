import { NextResponse } from "next/server";
import { toggleHeroImageStatus } from "@/actions/hero-image.actions";

export async function PUT(_req: Request, { params }: { params: { id: string } }) {
  const result = await toggleHeroImageStatus(Number(params.id));
  return NextResponse.json(result);
}
