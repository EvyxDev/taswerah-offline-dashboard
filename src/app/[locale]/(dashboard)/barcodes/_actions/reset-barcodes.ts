/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getAuthToken } from "@/lib/utils/auth.token";
import { revalidatePath } from "next/cache";

export default async function resetBarcodes() {
  const token = await getAuthToken();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/user-interface/reset-barcodes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to generate barcodes");
  }

  const payload: any = await response.json();
  revalidatePath("/barcodes");
  return payload;
}
