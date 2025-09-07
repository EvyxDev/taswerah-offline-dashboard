"use server";

import { getAuthToken } from "@/lib/utils/auth.token";
import { revalidatePath } from "next/cache";

export default async function deleteFrames(ids: Array<number | string>) {
  const token = await getAuthToken();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/branch-manager/frames/delete-many`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete frames");
  }

  const payload: APIResponse<unknown> = await response.json();
  revalidatePath("/settings");
  return payload;
}
