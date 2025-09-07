/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { getAuthToken } from "@/lib/utils/auth.token";
import { revalidatePath } from "next/cache";

export default async function editPhotographer(
  data: CreatePhotographerBody,
  id: string
) {
  const token = await getAuthToken();
  const sendData = {
    name: data.name,
    manager_email: data.email,
    manager_password: data.password,
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/branch-manager/photographers/${id}`,
    {
      method: "POST",
      body: JSON.stringify(sendData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(response);
  console.log(sendData);
  if (!response.ok) {
    throw new Error("Failed to Update photographer");
  }
  const payload: APIResponse<CreateBranchManagerResponse> =
    await response.json();
  revalidatePath("/employees");

  return payload;
}
