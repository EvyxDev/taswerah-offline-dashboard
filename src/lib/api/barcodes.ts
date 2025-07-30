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
