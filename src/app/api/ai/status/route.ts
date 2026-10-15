import { NextResponse } from "next/server";
import { providerStatus } from "@/modules/ai/providers";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(providerStatus());
}
