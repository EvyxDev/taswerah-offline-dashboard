/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAuthToken } from "../utils/auth.token";
type PaginatedEmployees = {
  success: true;
  message: string;
  data: Employee[];
  links: PaginationLinks;
  meta: PaginationMeta;
  photographer_count?: number;
};
export async function GetAllPhotographers(page = 1, limit = 10) {
  const token = await getAuthToken();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/branch-manager/staff?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );
    console.log(response);
    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    const payload: PaginatedEmployees = await response.json();

    if (!("data" in payload)) {
      throw new Error(payload);
    }

    return payload;
  } catch (error: any) {
    throw new Error(
      error?.message || "Unexpected error occurred while fetching Photographers"
    );
  }
}
