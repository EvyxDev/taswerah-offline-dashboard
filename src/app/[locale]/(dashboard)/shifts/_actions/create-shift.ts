"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { revalidatePath } from "next/cache";
import { CreateShift } from "@/lib/api/shifts.api";

export default async function createShift(
  data: TCreateShiftBody
): Promise<APIResponse<TShift>> {
  try {
    const created = await CreateShift(data);
    revalidatePath("/shifts");
    return {
      success: true,
      message: "Created",
      data: created,
    } as APIResponse<TShift>;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed",
      errors: [error?.message || "Failed"],
    } as any;
  }
}
