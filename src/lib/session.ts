import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { getOrCreateDemoUserId } from "./demo-user";

export async function getSession() {
  return getServerSession(authOptions);
}

export function isAuthDisabled() {
  return process.env.DISABLE_AUTH === "true";
}

export async function requireUserId(): Promise<string | null> {
  if (isAuthDisabled()) {
    return getOrCreateDemoUserId();
  }
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}
