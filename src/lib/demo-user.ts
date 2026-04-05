import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const DEMO_EMAIL = "preview@demo.local";

/**
 * Shared demo account when DISABLE_AUTH=true (UI preview). Returns null if DB is unavailable.
 */
export async function getOrCreateDemoUserId(): Promise<string | null> {
  try {
    const existing = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });
    if (existing) return existing.id;

    const created = await prisma.user.create({
      data: {
        email: DEMO_EMAIL,
        password: await bcrypt.hash("unused", 12),
        name: "Guest",
      },
    });
    return created.id;
  } catch {
    return null;
  }
}
