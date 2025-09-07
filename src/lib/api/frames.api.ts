/* eslint-disable @typescript-eslint/no-explicit-any */

export async function GetAllFrames(token: string): Promise<any[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/branch-manager/frames`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // Force server-side fetch
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch frames. Status: ${response.status}`);
  }

  const payload: APIResponse<Photo[]> = await response.json();
  if (!("data" in payload)) {
    throw new Error(payload.message);
  }
  return payload.data;
}
