"use server";

import { getAuthToken } from "@/lib/utils/auth.token";
import { revalidatePath } from "next/cache";

export default async function uploadStickers(formData: FormData) {
  const token = await getAuthToken();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/branch-manager/stickers`,
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload stickers");
  }

  const payload: APIResponse<unknown> = await response.json();
  revalidatePath("/settings");
  return payload;
}
