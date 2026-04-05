import { NextResponse } from "next/server";
import OpenAI from "openai";
import { TaskPriority } from "@prisma/client";
import { requireUserId } from "@/lib/session";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const allowedPriority = new Set(Object.values(TaskPriority));

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!openai) {
    return NextResponse.json(
      { error: "OpenAI is not configured. Set OPENAI_API_KEY on the server." },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const goal = typeof body.goal === "string" ? body.goal.trim() : "";
    if (!goal || goal.length < 3) {
      return NextResponse.json({ error: "Please describe your goal (at least 3 characters)." }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You help break goals into actionable tasks. Respond with JSON only, shape:
{"tasks":[{"title":"string","description":"string (optional)","priority":"LOW|MEDIUM|HIGH|URGENT"}]}
Use 5–10 tasks. Priorities must be one of: LOW, MEDIUM, HIGH, URGENT. Titles must be concise and actionable.`,
        },
        {
          role: "user",
          content: `Goal: ${goal}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return NextResponse.json({ error: "No response from AI." }, { status: 502 });
    }

    const parsed = JSON.parse(raw) as { tasks?: unknown };
    const list = Array.isArray(parsed.tasks) ? parsed.tasks : [];

    const tasks = list
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const o = item as Record<string, unknown>;
        const title = typeof o.title === "string" ? o.title.trim() : "";
        if (!title) return null;
        const description =
          typeof o.description === "string" && o.description.trim() ? o.description.trim() : undefined;
        let priority: TaskPriority = TaskPriority.MEDIUM;
        if (typeof o.priority === "string" && allowedPriority.has(o.priority as TaskPriority)) {
          priority = o.priority as TaskPriority;
        }
        return { title, description, priority };
      })
      .filter(Boolean) as { title: string; description?: string; priority: TaskPriority }[];

    if (tasks.length === 0) {
      return NextResponse.json({ error: "Could not parse AI tasks." }, { status: 502 });
    }

    return NextResponse.json({ tasks });
  } catch {
    return NextResponse.json({ error: "AI request failed." }, { status: 502 });
  }
}
