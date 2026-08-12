import { NextResponse } from "next/server";
import { toggleHeroImageStatus } from "@/actions/hero-image.actions";

export async function PUT(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const result = await toggleHeroImageStatus(Number(id));
  return NextResponse.json(result);
}
