"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Task } from "@prisma/client";
import { TaskStatus } from "@prisma/client";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCorners,
  useDroppable,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { PriorityBadge } from "@/components/tasks/priority-badge";
import { useTaskStore } from "@/store/task-store";
import { cn } from "@/lib/utils";

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: TaskStatus.TODO, title: "To do" },
  { id: TaskStatus.IN_PROGRESS, title: "In progress" },
  { id: TaskStatus.DONE, title: "Done" },
];

function Column({
  id,
  title,
  children,
}: {
  id: TaskStatus;
  title: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-[440px] flex-1 flex-col rounded-lg border border-border/80 bg-card/30 p-3 transition-colors md:min-h-[520px]",
        isOver && "border-primary/40 bg-primary/[0.04] ring-1 ring-primary/15"
      )}
    >
      <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {title}
      </h3>
      <div className="flex flex-1 flex-col gap-2">{children}</div>
    </div>
  );
}

function TaskCardContent({ task }: { task: Task }) {
  return (
    <>
      <p className="text-sm font-medium leading-snug text-foreground">{task.title}</p>
      <div className="mt-2">
        <PriorityBadge priority={task.priority} />
      </div>
    </>
  );
}

function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "glass rounded-lg border border-border/80 p-3 text-left transition-colors",
        "cursor-grab active:cursor-grabbing hover:border-border",
        isDragging && "opacity-40"
      )}
    >
      <TaskCardContent task={task} />
    </div>
  );
}

export function KanbanBoard() {
  const { tasks, setTasks, patchTask, replaceTask } = useTaskStore();
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error();
      setTasks((await res.json()) as Task[]);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [setTasks]);

  useEffect(() => {
    load();
  }, [load]);

  const byStatus = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      TODO: [],
      IN_PROGRESS: [],
      DONE: [],
    };
    for (const t of tasks) {
      map[t.status].push(t);
    }
    return map;
  }, [tasks]);

  function onDragStart(event: DragStartEvent) {
    const id = event.active.id as string;
    const task = tasks.find((t) => t.id === id) ?? null;
    setActive(task);
  }

  async function onDragEnd(event: DragEndEvent) {
    const { active: a, over } = event;
    setActive(null);
    if (!over) return;

    const taskId = a.id as string;
    const overId = over.id as string;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const columnIds = COLUMNS.map((c) => c.id);
    let newStatus: TaskStatus | null = null;
    if (columnIds.includes(overId as TaskStatus)) {
      newStatus = overId as TaskStatus;
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) newStatus = overTask.status;
    }

    if (!newStatus || newStatus === task.status) return;

    const prev = { ...task };
    patchTask(taskId, { status: newStatus });

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      const updated = (await res.json()) as Task;
      replaceTask(updated);
    } catch {
      replaceTask(prev);
    }
  }

  if (loading) {
    return <p className="text-center text-sm text-muted-foreground">Loading board…</p>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-4 md:grid-cols-3"
      >
        {COLUMNS.map((col) => (
          <Column key={col.id} id={col.id} title={col.title}>
            {byStatus[col.id].map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </Column>
        ))}
      </motion.div>
      <DragOverlay dropAnimation={null}>
        {active ? (
          <div className="glass w-[260px] rounded-lg border border-primary/25 bg-card/90 p-3 shadow-lg">
            <TaskCardContent task={active} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
