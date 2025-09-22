/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthToken } from "@/lib/utils/auth.token";

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken();
    const { searchParams } = new URL(request.url);

    const employeeId = searchParams.get("employee_id");
    const employeeName = searchParams.get("employeeName");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const url = new URL(
      `${process.env.NEXT_PUBLIC_API}/branch-manager/sync/filter`
    );

    if (employeeId) url.searchParams.set("employee_id", employeeId);
    if (employeeName) url.searchParams.set("employeeName", employeeName);
    if (from) url.searchParams.set("from", from);
    if (to) url.searchParams.set("to", to);

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
        message: error?.message || "Failed to fetch sync filter data",
      },
      { status: 500 }
    );
  }
}
