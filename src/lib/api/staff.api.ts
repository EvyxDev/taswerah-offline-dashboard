type StaffAPIResponse = {
  data: {
    data: TStaff[];
    links: {
      first: string;
      last: string;
      prev: string | null;
      next: string | null;
    };
    meta: {
      current_page: number;
      from: number;
      last_page: number;
      links: Array<{
        url: string | null;
        label: string;
      }>;
    };
  };
};
export async function GetStaff(
  token: string,
  page: number,
  limit: number
): Promise<StaffAPIResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/staff?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const payload: StaffAPIResponse = await response.json();

  if (!("data" in payload)) {
    throw new Error("Response does not contain staff data");
  }

  return payload;
}
