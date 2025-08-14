/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAuthToken } from "@/lib/utils/auth.token";

export async function GetShifts(): Promise<TShift[]> {
  try {
    const token = await getAuthToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/branch-manager/shifts`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch shifts. Status: ${response.status}`);
    }
    const payload: APIResponse<TShift[]> = await response.json();
    if (!("data" in payload)) {
      throw new Error(payload as any);
    }
    return payload.data;
  } catch (error: any) {
    throw new Error(
      error?.message || "Unexpected error occurred while fetching shifts"
    );
  }
}

export async function CreateShift(data: TCreateShiftBody): Promise<TShift> {
  try {
    const token = await getAuthToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/branch-manager/shifts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to create shift. Status: ${response.status}`);
    }
    const payload: APIResponse<TShift> = await response.json();
    if (!("data" in payload)) {
      throw new Error(payload.message);
    }
    return payload.data;
  } catch (error: any) {
    throw new Error(
      error?.message || "Unexpected error occurred while creating shift"
    );
  }
}

export async function UpdateShift(
  id: number | string,
  data: TUpdateShiftBody
): Promise<TShift> {
  try {
    const token = await getAuthToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/branch-manager/shifts/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to update shift. Status: ${response.status}`);
    }
    const payload: APIResponse<TShift> = await response.json();
    if (!("data" in payload)) {
      throw new Error(payload.message);
    }
    return payload.data;
  } catch (error: any) {
    throw new Error(
      error?.message || "Unexpected error occurred while updating shift"
    );
  }
}

export async function DeleteShift(id: number | string): Promise<boolean> {
  try {
    const token = await getAuthToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/branch-manager/shifts/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to delete shift. Status: ${response.status}`);
    }
    return true;
  } catch (error: any) {
    throw new Error(
      error?.message || "Unexpected error occurred while deleting shift"
    );
  }
}
