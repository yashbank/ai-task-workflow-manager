import { NextResponse } from "next/server";
import { TaskPriority, TaskStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";

const statusValues = new Set(Object.values(TaskStatus));
const priorityValues = new Set(Object.values(TaskPriority));

type Params = { params: { id: string } };

export async function PATCH(req: Request, { params }: Params) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;

  const existing = await prisma.task.findFirst({
    where: { id, userId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const body = await req.json();

    const data: {
      title?: string;
      description?: string | null;
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: Date | null;
    } = {};

    if (typeof body.title === "string") {
      const t = body.title.trim();
      if (!t) return NextResponse.json({ error: "Title cannot be empty." }, { status: 400 });
      data.title = t;
    }

    if (body.description !== undefined) {
      data.description =
        typeof body.description === "string" && body.description.trim()
          ? body.description.trim()
          : null;
    }

    if (typeof body.status === "string") {
      if (!statusValues.has(body.status as TaskStatus)) {
        return NextResponse.json({ error: "Invalid status." }, { status: 400 });
      }
      data.status = body.status as TaskStatus;
    }

    if (typeof body.priority === "string") {
      if (!priorityValues.has(body.priority as TaskPriority)) {
        return NextResponse.json({ error: "Invalid priority." }, { status: 400 });
      }
      data.priority = body.priority as TaskPriority;
    }

    if (body.dueDate !== undefined) {
      if (body.dueDate === null || body.dueDate === "") {
        data.dueDate = null;
      } else if (typeof body.dueDate === "string") {
        const d = new Date(body.dueDate);
        if (Number.isNaN(d.getTime())) {
          return NextResponse.json({ error: "Invalid due date." }, { status: 400 });
        }
        data.dueDate = d;
      }
    }

    const task = await prisma.task.update({
      where: { id },
      data,
    });

    return NextResponse.json(task);
  } catch {
    return NextResponse.json({ error: "Could not update task." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;

  const existing = await prisma.task.findFirst({
    where: { id, userId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
