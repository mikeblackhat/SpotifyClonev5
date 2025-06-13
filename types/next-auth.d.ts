import { AuthConfig } from "../auth.config";
import { DefaultSession, DefaultUser } from "next-auth";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      MONGODB_URI: string;
      MONGODB_DB: string;
    }
  }
}

declare module "next-auth" {
  /**
   * Extiende la interfaz de usuario por defecto de NextAuth
   */
  interface User extends DefaultUser {
    id: string;
    plan?: string;
    provider?: string;
  }

  /**
   * Extiende la interfaz de sesión para incluir los campos personalizados
   */
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      plan?: string;
      provider?: string;
    };
  }
}

declare module "next-auth/jwt" {
  /**
   * Extiende la interfaz JWT para incluir los campos personalizados
   */
  interface JWT {
    id: string;
    plan?: string;
    provider?: string;
  }
}
