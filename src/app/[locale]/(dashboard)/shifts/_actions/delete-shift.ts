"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { revalidatePath } from "next/cache";
import { DeleteShift } from "@/lib/api/shifts.api";

export default async function deleteShift(
  id: number | string
): Promise<APIResponse<null>> {
  try {
    await DeleteShift(id);
    revalidatePath("/shifts");
    return { success: true, message: "Deleted", data: null } as any;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed",
      errors: [error?.message || "Failed"],
    } as any;
  }
}
