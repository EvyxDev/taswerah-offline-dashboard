/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getAuthToken } from "@/lib/utils/auth.token";

export async function GET() {
  try {
    const token = await getAuthToken();

    const url = new URL(
      `${process.env.NEXT_PUBLIC_API}/branch-manager/sync/last`
    );

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
      {
        success: false,
        message: error?.message || "Failed to fetch sync data",
      },
      { status: 500 }
    );
  }
}
