/* eslint-disable @typescript-eslint/no-explicit-any */
export type ExportStatsResponse = {
  photographers: { id: number; name: string; total_photos: number }[];
  daily_stats: {
    date: string;
    total_paid: number;
    shifts: { shift_id: number; amount_paid: number }[];
  }[];
};

export type BranchManagerSyncResponse = {
  last_sync_time: string;
  sync_job_id: number;
};

export type BranchManagerSyncFilterResponse = {
  sync_jobs: Array<{
    id: number;
    branch_id: number;
    employee_id: number | null;
    employeeName: string;
    pay_amount: string;
    orderprefixcode: string;
    status: string;
    shift_name: string;
    orderphone: string;
    number_of_photos: number;
    created_at: string;
    updated_at: string;
  }>;
  statistics: {
    total_photos: number;
    total_money: number;
  };
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

export async function GetBranchManagerSyncLast(): Promise<BranchManagerSyncResponse> {
  try {
    console.log("Fetching sync data...");
    const response = await fetch("/api/branch-manager/sync/last", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error response:", errorText);
      throw new Error(`Failed to fetch sync data. Status: ${response.status}`);
    }

    const responseText = await response.text();
    console.log("Raw response:", responseText);

    let payload: BranchManagerSyncResponse;
    try {
      payload = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      throw new Error("Invalid JSON response from server");
    }

    console.log("Parsed sync data:", payload);

    // Validate the response structure
    if (!payload.last_sync_time || !payload.sync_job_id) {
      console.error("Invalid response structure:", payload);
      throw new Error("Invalid response structure from server");
    }

    return payload;
  } catch (error: any) {
    console.error("GetBranchManagerSyncLast error:", error);
    throw new Error(
      error?.message || "Unexpected error during sync data fetch"
    );
  }
}

export async function GetBranchManagerSyncFilter(params: {
  employee_id?: string;
  employeeName?: string;
  from?: string;
  to?: string;
}): Promise<BranchManagerSyncFilterResponse> {
  try {
    console.log("Fetching sync filter data...", params);
    const query = new URLSearchParams();
    if (params.employee_id) query.set("employee_id", params.employee_id);
    if (params.employeeName) query.set("employeeName", params.employeeName);
    if (params.from) query.set("from", params.from);
    if (params.to) query.set("to", params.to);

    const href = `/api/branch-manager/sync/filter${
      query.toString() ? `?${query.toString()}` : ""
    }`;

    const response = await fetch(href, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    console.log("Filter response status:", response.status);
    console.log("Filter response ok:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Filter error response:", errorText);
      throw new Error(
        `Failed to fetch sync filter data. Status: ${response.status}`
      );
    }

    const responseText = await response.text();
    console.log("Raw filter response:", responseText);

    let payload: BranchManagerSyncFilterResponse;
    try {
      payload = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Filter JSON parse error:", parseError);
      throw new Error("Invalid JSON response from server");
    }

    console.log("Parsed sync filter data:", payload);
    return payload;
  } catch (error: any) {
    console.error("GetBranchManagerSyncFilter error:", error);
    throw new Error(
      error?.message || "Unexpected error during sync filter data fetch"
    );
  }
}
