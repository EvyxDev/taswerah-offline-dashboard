/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth/next";
import { getAuthToken } from "../utils/auth.token";

export async function GetPaymentsByBransh(): Promise<paymentStates> {
  try {
    // Get the session to extract user ID
    const token = await getAuthToken();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new Error("User not authenticated or user ID not found in session");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/branch-manager/payments/${1}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(
      `${process.env.NEXT_PUBLIC_API}/onlinedashboard/admin/payments/${session.user.id}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    const payload: APIResponse<paymentStates> = await response.json();

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
