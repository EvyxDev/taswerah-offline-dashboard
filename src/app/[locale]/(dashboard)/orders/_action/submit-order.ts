"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { revalidatePath } from "next/cache";
import { getAuthToken } from "@/lib/utils/auth.token";

export async function SubmitOrderAction(
  id: number | string,
  data: { shift_id: number; pay_amount: number }
): Promise<APIResponse<any>> {
  try {
    const token = await getAuthToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/branch-manager/orders_submit/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to submit order. Status: ${response.status}`);
    }

    const payload: APIResponse<any> = await response.json();

    revalidatePath("/orders");
    return payload;
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.message || "Unexpected error occurred while submitting order",
    } as any;
  }
}
