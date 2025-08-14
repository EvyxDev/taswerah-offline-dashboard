"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAuthToken } from "@/lib/utils/auth.token";
import { revalidatePath } from "next/cache";

export async function CreateOrder(formData: FormData): Promise<any> {
  try {
    const token = await getAuthToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/branch-manager/orders/upload-and-create`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    console.log(response);
    if (!response.ok) {
      throw new Error(`Failed to create order. Status: ${response.status}`);
    }

    const responseData: APIResponse<any> = await response.json();

    if (!("data" in responseData)) {
      throw new Error(responseData.message);
    }

    revalidatePath("/orders");
    return responseData.data;
  } catch (error: any) {
    console.error("CreateOrder error:", error);
    throw new Error(
      error?.message || "Unexpected error occurred while creating order"
    );
  }
}
