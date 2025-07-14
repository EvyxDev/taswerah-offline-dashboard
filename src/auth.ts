import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { JSON_HEADER } from "./lib/constants/api.constant";
import { customStuff } from "./lib/types/auth";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        phone: {},
        password: {},
      },
      authorize: async (credentials) => {
        const response = await fetch(
          `${process.env.API}/branch-manager/login`,
          {
            method: "POST",
            body: JSON.stringify({
              phone: credentials?.phone,
              password: credentials?.password,
            }),
            headers: {
              ...JSON_HEADER,
            },
          }
        );

        const payload: APIResponse<customStuff> = await response.json();
        // Throw an auth error if the login has failed
        if (!payload.success) {
          throw new Error(payload.message);
        }

        const successPayload = payload as SuccessfulResponse<customStuff>;

        // Return the user object that matches the User interface
        return {
          id: successPayload.data.manager._id,
          manager: successPayload.data.manager,
          token: successPayload.data.token,
        };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      // If the user exists it was a successful login attempt, so save the new user data in the cookies
      if (user) {
        token.manager = user.manager;
        token.token = user.token;
      }

      return token;
    },
    session: ({ session, token }) => {
      session.user = token.manager;
      session.token = token.token;

      return session;
    },
  },
};
