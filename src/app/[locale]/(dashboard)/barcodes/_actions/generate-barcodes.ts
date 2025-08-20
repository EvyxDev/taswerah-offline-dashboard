/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getAuthToken } from "@/lib/utils/auth.token";
import { revalidatePath } from "next/cache";

export default async function generateBarcodes(quantity: number) {
  const token = await getAuthToken();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/branch-manager/users/generate-barcodes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to generate barcodes");
  }

  const payload: any = await response.json();
  revalidatePath("/barcodes");
  return payload;
}
