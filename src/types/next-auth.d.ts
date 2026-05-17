import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      phone?: string;
      role?: "user" | "admin";
    } & DefaultSession["user"];
  }

  interface User {
    phone?: string;
    role?: "user" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    phone?: string;
    role?: "user" | "admin";
  }
}
