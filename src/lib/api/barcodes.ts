/* eslint-disable @typescript-eslint/no-explicit-any */
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
