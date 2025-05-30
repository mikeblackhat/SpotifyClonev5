import { AuthConfig } from "../auth.config";
import { DefaultSession } from "next-auth";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;
    }
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      username?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    name?: string | null;
    username?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
