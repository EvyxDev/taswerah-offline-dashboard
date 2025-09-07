/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { getAuthToken } from "@/lib/utils/auth.token";
import { revalidatePath } from "next/cache";

export default async function createPhotographer(data: CreatePhotographerBody) {
  const token = await getAuthToken();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/branch-manager/photographers`,
    {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        manager_email: data.email,
        manager_password: data.password,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create photographer");
  }
  const payload: APIResponse<CreateBranchManagerResponse> =
    await response.json();
  revalidatePath("/employees");

  return payload;
}
