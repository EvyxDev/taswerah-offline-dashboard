"use server";

import { getAuthToken } from "@/lib/utils/auth.token";

export async function PrintConfirmation(id: string, method: string) {
  const token = await getAuthToken();
  try {
    const response = await fetch(
      `${process.env.API}/branch-manager/invoices/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          invoice_method: method,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const payload: APIResponse<TInvoice> = await response.json();

    if (!("data" in payload)) {
      throw new Error("Response does not TInvoice");
    }

    return payload;
  } catch (error) {
    console.error("Print confirmation failed:", error);
  }
}
