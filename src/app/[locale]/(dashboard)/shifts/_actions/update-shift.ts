"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { revalidatePath } from "next/cache";
import { UpdateShift } from "@/lib/api/shifts.api";

export default async function updateShift(
  id: number | string,
  data: TUpdateShiftBody
): Promise<APIResponse<TShift>> {
  try {
    const updated = await UpdateShift(id, data);
    revalidatePath("/shifts");
    return {
      success: true,
      message: "Updated",
      data: updated,
    } as APIResponse<TShift>;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed",
      errors: [error?.message || "Failed"],
    } as any;
  }
}
