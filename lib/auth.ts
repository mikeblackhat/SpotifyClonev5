import { getServerSession } from "next-auth";
import { authConfig } from "@/auth.config";

export async function getCurrentUser() {
  const session = await getServerSession(authConfig);
  return session?.user;
}

export async function getSession() {
  return await getServerSession(authConfig);
}
