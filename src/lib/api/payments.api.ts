/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth/next";
import { getAuthToken } from "../utils/auth.token";

export async function GetPaymentsByBransh(
  shiftId?: string | number,
  fromDate?: string,
  toDate?: string,
  staffId?: string | number
): Promise<paymentStates2> {
  try {
    // Get the session to extract user ID
    const token = await getAuthToken();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new Error("User not authenticated or user ID not found in session");
    }

    const url = new URL(
      `${process.env.NEXT_PUBLIC_API}/branch-manager/payments/dashboard`
    );
    if (shiftId !== undefined && shiftId !== null && `${shiftId}`.length > 0) {
      url.searchParams.set("shift_id", String(shiftId));
    }
    if (fromDate) {
      url.searchParams.set("from_date", fromDate);
    }
    if (toDate) {
      url.searchParams.set("to_date", toDate);
    }
    if (staffId !== undefined && staffId !== null && `${staffId}`.length > 0) {
      url.searchParams.set("staff_id", String(staffId));
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    console.log(
      `${process.env.NEXT_PUBLIC_API}/onlinedashboard/admin/payments/${session.user.id}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    const payload: APIResponse<paymentStates2> = await response.json();

    if (!("data" in payload)) {
      throw new Error(payload.message);
    }

    return payload.data;
  } catch (error: any) {
    console.error("GetPaymentsByBransh error:", error);
    throw new Error(
      error?.message || "Unexpected error occurred while fetching payments"
    );
  }
}
