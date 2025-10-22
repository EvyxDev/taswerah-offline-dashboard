"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAuthToken } from "@/lib/utils/auth.token";
import { revalidatePath } from "next/cache";

export async function SendPhotosAction(
  orderId: string | number,
  sendType: "send" | "print" | "print_and_send"
): Promise<APIResponse<any>> {
  try {
    const token = await getAuthToken();
    const response = await fetch(
      `${process.env.API}/branch-manager/orders/${orderId}/photos?send_type=${sendType}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    console.log(response);

    if (!response.ok) {
      throw new Error(
        `Failed to send/print photos. Status: ${response.status}`
      );
    }

    const payload = (await response.json()) as APIResponse<any>;
    revalidatePath("/ready-to-print");
    return payload;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed" } as any;
  }
}
