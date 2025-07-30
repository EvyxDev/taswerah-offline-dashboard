//auth.d.ts
import { User } from "next-auth";

export type LoginResponse = Pick<User, "token" | "user">;

export type RegisterResponse = Pick<User, "token" | "user">;

export interface customStuff extends User {
  manager: {
    id: number;
    name: string;
    email: string;
    phone: string;
    branch: number;
  } & DatabaseProperies;
  token: string;
}
