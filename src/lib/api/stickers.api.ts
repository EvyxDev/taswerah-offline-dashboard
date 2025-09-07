/* eslint-disable @typescript-eslint/no-explicit-any */

export async function GetAllStickers(token: string): Promise<any[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/branch-manager/stickers`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch stickers. Status: ${response.status}`);
  }

  const payload: APIResponse<Photo[]> = await response.json();
  if (!("data" in payload)) {
    throw new Error(payload.message);
  }
  return payload.data;
}
