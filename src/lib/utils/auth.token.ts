//getAuthToken
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export const getAuthToken = async () => {
  try {
    const jwt = (await cookies()).get("next-auth.session-token")?.value;

    if (!jwt) {
      console.error("No session token found in cookies");
      return null;
    }

    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      throw new Error("Server configuration error");
    }

    const decodedToken = await decode({ token: jwt, secret });

    if (!decodedToken) {
      console.error("Failed to decode JWT");
      return null;
    }

    const userToken = decodedToken.token as string | undefined;
    if (!userToken) {
      console.error("No user token found in decoded JWT");
      return null;
    }

    return userToken;
  } catch (error) {
    console.error("Error retrieving auth token:", error);
    return null;
  }
};
