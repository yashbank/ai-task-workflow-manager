import { NextResponse } from "next/server";
import { TaskPriority } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";

const priorityValues = new Set(Object.values(TaskPriority));

type Incoming = { title: string; description?: string; priority?: TaskPriority };

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const raw = body.tasks;
    if (!Array.isArray(raw) || raw.length === 0) {
      return NextResponse.json({ error: "Expected non-empty tasks array." }, { status: 400 });
    }

    const tasks: Incoming[] = [];
    for (const item of raw) {
      if (!item || typeof item !== "object") continue;
      const o = item as Record<string, unknown>;
      const title = typeof o.title === "string" ? o.title.trim() : "";
      if (!title) continue;
      const description =
        typeof o.description === "string" && o.description.trim() ? o.description.trim() : undefined;
      let priority: TaskPriority = TaskPriority.MEDIUM;
      if (typeof o.priority === "string" && priorityValues.has(o.priority as TaskPriority)) {
        priority = o.priority as TaskPriority;
      }
      tasks.push({ title, description, priority });
    }

    if (tasks.length === 0) {
      return NextResponse.json({ error: "No valid tasks to create." }, { status: 400 });
    }

    await prisma.task.createMany({
      data: tasks.map((t) => ({
        userId,
        title: t.title,
        description: t.description ?? null,
        priority: t.priority ?? TaskPriority.MEDIUM,
      })),
    });

    return NextResponse.json({ count: tasks.length });
  } catch {
    return NextResponse.json({ error: "Bulk create failed." }, { status: 500 });
  }
}
