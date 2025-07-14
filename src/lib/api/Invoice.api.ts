export async function GetInvoice(id: string, token: string) {
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

  const payload: APIResponse<TInvoice> = await response.json();

  if (!("data" in payload)) {
    throw new Error("Response does not TInvoice");
  }

  return payload.data;
}

export async function GetReadyToPrintCodes(token: string) {
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

  const payload: APIResponse<{ barcodes: string[] }> = await response.json();

  if (!("data" in payload)) {
    throw new Error("Response does not contain data");
  }

  return payload.data;
}
