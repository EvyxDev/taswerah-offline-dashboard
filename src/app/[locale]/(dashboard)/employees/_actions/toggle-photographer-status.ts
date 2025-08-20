/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getAuthToken } from "@/lib/utils/auth.token";
import { revalidatePath } from "next/cache";

export default async function togglePhotographerStatus(
  photographerId: string | number,
  status: "active" | "inactive"
) {
  const token = await getAuthToken();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/branch-manager/photographers/${photographerId}`,
    {
      method: "POST",
      body: JSON.stringify({ status }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to toggle photographer status");
  }

  const payload: APIResponse<any> = await response.json();
  revalidatePath("/employees");

  return payload;
}
