/* eslint-disable @typescript-eslint/no-explicit-any */

import { getServerSession } from "next-auth";
import { getAuthToken } from "../utils/auth.token";
import { authOptions } from "@/auth";

declare type Client = {
  id: number;
  barcode: string;
  phone_number: string;
  branch_id: number;
  last_visit: string;
  created_at: string;
  updated_at: string;
};
export async function GetClentsByBranch() {
  try {
    // Get the session to extract user ID
    const token = await getAuthToken();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new Error("User not authenticated or user ID not found in session");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/branch-manager/payments/clients/${1}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          cache: "no-store",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    const payload: APIResponse<Client[]> = await response.json();

    if (!("data" in payload)) {
      throw new Error(payload.message);
    }

    return payload;
  } catch (error: any) {
    throw new Error(
      error?.message || "Unexpected error occurred while fetching Clients"
    );
  }
}
