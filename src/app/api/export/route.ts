/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthToken } from "@/lib/utils/auth.token";

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken();
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from_date") || undefined;
    const to = searchParams.get("to_date") || undefined;

    const url = new URL(`${process.env.NEXT_PUBLIC_API}/branch-manager/export`);
    if (from) url.searchParams.set("from_date", from);
    if (to) url.searchParams.set("to_date", to);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const payload = await response.json();
    if (!response.ok) {
      return NextResponse.json(payload, { status: response.status });
    }
    return NextResponse.json(payload);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Export failed" },
      { status: 500 }
    );
  }
}
