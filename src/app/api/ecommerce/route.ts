import { NextResponse } from "next/server";

import { fetchEcommerceSheetData } from "@/lib/google-sheets";

export async function GET() {
  const data = await fetchEcommerceSheetData();
  if (!data) {
    return NextResponse.json({ error: "Failed to load Google Sheet data" }, { status: 500 });
  }
  return NextResponse.json(data);
}
