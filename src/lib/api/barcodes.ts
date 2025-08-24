/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAuthToken } from "../utils/auth.token";

export async function GetPrintedCodes(token: string) {
  try {
    const response = await fetch(
      `${process.env.API}/branch-manager/photos/printed`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch printed codes. Status: ${response.status}`
      );
    }

    const payload: APIResponse<{ barcodes: string[] }> = await response.json();

    if (!("data" in payload)) {
      throw new Error("Invalid API response: missing 'data' field");
    }

    return payload.data;
  } catch (error: any) {
    console.error("GetReadyToPrintCodes error:", error);
    throw new Error(
      error?.message || "Unexpected error occurred while fetching printed"
    );
  }
}

export async function getPhotosByBarcode(token: string, barcode: string) {
  try {
    const response = await fetch(
      `${process.env.API}/branch-manager/photos/printed/${barcode}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    if (!response.ok) {
      throw new Error("error in response");
    }
    const payload: APIResponse<Photo[]> = await response.json();
    if (!("data" in payload)) {
      throw new Error("error in response");
    }

    return payload.data;
  } catch {
    throw new Error("Error in catch");
  }
}

export async function GetOrdersBySendType(
  token: string,
  type: "print" | "send"
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/branch-manager/orders/by-send-type?type=${type}`,
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
      throw new Error(
        `Failed to fetch orders by send type. Status: ${response.status}`
      );
    }

    const payload = (await response.json()) as APIResponse<{
      barcodes: string[];
    }>;
    if (!("data" in payload)) {
      throw new Error("Invalid API response: missing 'data' field");
    }
    return payload.data;
  } catch (error: any) {
    throw new Error(
      error?.message ||
        "Unexpected error occurred while fetching orders by send type"
    );
  }
}

// Fetch paginated user barcodes
export type BarcodeItem = {
  barcode: string;
  used: boolean;
};

export type PaginatedBarcodes = {
  current_page: number;
  data: BarcodeItem[];
  last_page: number;
  per_page: number | string;
  total: number;
};

export async function GetUserBarcodes(
  page = 1,
  perPage = 15,
  filter?: "yes" | "no"
) {
  const token = await getAuthToken();
  try {
    const params = new URLSearchParams({
      per_page: String(perPage),
      page: String(page),
    });
    if (filter === "yes") {
      params.set("filter", "yes");
    }

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API
      }/branch-manager/users/barcodes?${params.toString()}`,
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
      throw new Error(`Failed to fetch barcodes. Status: ${response.status}`);
    }

    const payload = (await response.json()) as PaginatedBarcodes;
    if (!payload || !Array.isArray(payload.data)) {
      throw new Error("Invalid barcodes API response");
    }
    return payload;
  } catch (error: any) {
    throw new Error(error?.message || "Unexpected error fetching barcodes");
  }
}
