import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/actions/auth.actions";

// Converted from app/modules/auth/routes/api.php POST /register
export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await registerUser(body);
  return NextResponse.json(result, { status: result.success ? 201 : 422 });
}
