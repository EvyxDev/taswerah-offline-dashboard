"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { revalidatePath } from "next/cache";
import { getAuthToken } from "@/lib/utils/auth.token";

export async function CancelOrderAction(
  barcode: string
): Promise<APIResponse<any>> {
  try {
    const token = await getAuthToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/branch-manager/orders/${barcode}/cancel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const payload: APIResponse<any> = await response.json();
    console.log(response);
    console.log(payload);
    if (!response.ok) {
      return payload;
    }

    revalidatePath("/orders");
    return payload;
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.message || "Unexpected error occurred while cancelling order",
    } as any;
  }
}
