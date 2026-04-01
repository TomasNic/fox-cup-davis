import { NextRequest, NextResponse } from "next/server";
import { logoutAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await logoutAdmin();
  return NextResponse.redirect(new URL("/admin", req.url));
}
