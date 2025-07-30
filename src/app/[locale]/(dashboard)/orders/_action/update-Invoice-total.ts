"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAuthToken } from "@/lib/utils/auth.token";
import { revalidatePath } from "next/cache";

type UpdateInvoiceTotalPayload = {
  total_amount: number;
};

export async function UpdateInvoiceTotal(
  barcode: string,
  total_amount: number
): Promise<any> {
  try {
    // Get the session to extract user ID
    const token = await getAuthToken();

    const payload: UpdateInvoiceTotalPayload = {
      total_amount,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/branch-manager/invoices/update-total/${barcode}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to update invoice total. Status: ${response.status}`
      );
    }

    const responseData: APIResponse<any> = await response.json();

    if (!("data" in responseData)) {
      throw new Error(responseData.message);
    }

    revalidatePath("/orders");
    return responseData.data;
  } catch (error: any) {
    console.error("UpdateInvoiceTotal error:", error);
    throw new Error(
      error?.message || "Unexpected error occurred while updating invoice total"
    );
  }
}
