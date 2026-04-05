import { NextResponse } from "next/server";
import { TaskPriority, TaskStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";

const statusValues = new Set(Object.values(TaskStatus));
const priorityValues = new Set(Object.values(TaskPriority));

export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: [{ dueDate: "asc" }, { updatedAt: "desc" }],
  });

  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }

    const description =
      typeof body.description === "string" && body.description.trim()
        ? body.description.trim()
        : null;

    const status =
      typeof body.status === "string" && statusValues.has(body.status as TaskStatus)
        ? (body.status as TaskStatus)
        : TaskStatus.TODO;

    const priority =
      typeof body.priority === "string" && priorityValues.has(body.priority as TaskPriority)
        ? (body.priority as TaskPriority)
        : TaskPriority.MEDIUM;

    let dueDate: Date | null = null;
    if (typeof body.dueDate === "string" && body.dueDate) {
      const d = new Date(body.dueDate);
      if (!Number.isNaN(d.getTime())) dueDate = d;
    }

    const task = await prisma.task.create({
      data: {
        userId,
        title,
        description,
        status,
        priority,
        dueDate,
      },
    });

    return NextResponse.json(task);
  } catch {
    return NextResponse.json({ error: "Could not create task." }, { status: 500 });
  }
}
