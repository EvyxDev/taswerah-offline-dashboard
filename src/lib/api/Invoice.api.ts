/* eslint-disable @typescript-eslint/no-explicit-any */
export async function GetInvoice(id: string, token: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/branch-manager/invoices/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch invoice. Status: ${response.status}`);
    }

    const payload: APIResponse<TInvoice> = await response.json();

    if (!("data" in payload)) {
      throw new Error("Invalid API response: missing 'data' field");
    }

    return payload.data;
  } catch (error: any) {
    console.error("GetInvoice error:", error);
    throw new Error(
      error?.message || "Unexpected error occurred while fetching invoice"
    );
  }
}
export async function GetInvoiceByClient(id: string, token: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/branch-manager/payments/invoices/1/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch invoice. Status: ${response.status}`);
    }
    console.log(response);
    const payload: APIResponse<TInvoice[]> = await response.json();

    if (!("data" in payload)) {
      throw new Error("Invalid API response: missing 'data' field");
    }

    return payload.data;
  } catch (error: any) {
    console.error("GetInvoice error:", error);
    throw new Error(
      error?.message || "Unexpected error occurred while fetching invoice"
    );
  }
}
export async function GetAllInvoices(token: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/branch-manager/invoices/active`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch invoice. Status: ${response.status}`);
    }

    const payload: APIResponse<TInvoice[]> = await response.json();
    console.log(payload);

    if (!("data" in payload)) {
      throw new Error("Invalid API response: missing 'data' field");
    }

    return payload.data;
  } catch (error: any) {
    console.error("GetInvoice error:", error);
    throw new Error(
      error?.message || "Unexpected error occurred while fetching invoice"
    );
  }
}
export async function GetAllOrders(token: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/branch-manager/orders?lmit=1000`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch invoice. Status: ${response.status}`);
    }

    const payload: APIResponse<TOrdersRespnse> = await response.json();

    if (!("data" in payload)) {
      throw new Error("Invalid API response: missing 'data' field");
    }

    return payload.data;
  } catch (error: any) {
    console.error("GetInvoice error:", error);
    throw new Error(
      error?.message || "Unexpected error occurred while fetching invoice"
    );
  }
}

export async function GetReadyToPrintCodes(token: string) {
  try {
    const response = await fetch(
      `${process.env.API}/branch-manager/photos/ready-to-print`,
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
        `Failed to fetch ready-to-print codes. Status: ${response.status}`
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
      error?.message ||
        "Unexpected error occurred while fetching ready-to-print codes"
    );
  }
}
export async function GetUploadedbBarcodes(token: string, id: string) {
  try {
    const response = await fetch(
      `${process.env.API}/branch-manager/staff/${id}/uploaded-barcodes`,
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
        `Failed to fetch ready-to-print codes. Status: ${response.status}`
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
      error?.message ||
        "Unexpected error occurred while fetching ready-to-print codes"
    );
  }
}

export async function SubmitOrder(
  id: number | string,
  data: { shift_id: number; pay_amount: number },
  token: string
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/branch-manager/orders_submit/${id}`,
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
      throw new Error(`Failed to submit order. Status: ${response.status}`);
    }

    const payload: APIResponse<any> = await response.json();

    if (!("message" in payload)) {
      throw new Error("Invalid API response");
    }

    return payload;
  } catch (error: any) {
    throw new Error(
      error?.message || "Unexpected error occurred while submitting order"
    );
  }
}
