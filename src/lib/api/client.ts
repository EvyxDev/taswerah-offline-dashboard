/* eslint-disable @typescript-eslint/no-explicit-any */
export type ExportStatsResponse = {
  photographers: { id: number; name: string; total_photos: number }[];
  daily_stats: {
    date: string;
    total_paid: number;
    shifts: { shift_id: number; amount_paid: number }[];
  }[];
};

export async function GetExportStats(params: {
  from_date?: string;
  to_date?: string;
}): Promise<ExportStatsResponse> {
  try {
    const query = new URLSearchParams();
    if (params.from_date) query.set("from_date", params.from_date);
    if (params.to_date) query.set("to_date", params.to_date);
    const href = `/api/export${query.toString() ? `?${query.toString()}` : ""}`;

    const response = await fetch(href, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to export stats. Status: ${response.status}`);
    }

    const payload: APIResponse<ExportStatsResponse> = await response.json();
    if (!("data" in payload)) {
      throw new Error(payload.message);
    }
    return payload.data;
  } catch (error: any) {
    console.error("GetExportStats error:", error);
    throw new Error(error?.message || "Unexpected error during export stats");
  }
}
