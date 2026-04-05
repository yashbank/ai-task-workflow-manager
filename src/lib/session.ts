import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireUserId() {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  if (!id) return null;
  return id;
}
