"use client";

import { useCallback, useEffect, useState } from "react";
import type { Task } from "@prisma/client";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { PriorityBadge } from "@/components/tasks/priority-badge";
import { StatusBadge } from "@/components/tasks/status-badge";
import { useTaskStore } from "@/store/task-store";

export default function TasksPage() {
  const { tasks, setTasks, addTask, replaceTask, removeTask } = useTaskStore();
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<Task | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error();
      const data = (await res.json()) as Task[];
      setTasks(data);
    } catch {
      toast.error("Could not load tasks.");
    } finally {
      setLoading(false);
    }
  }, [setTasks]);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setDialogMode("create");
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(task: Task) {
    setDialogMode("edit");
    setEditing(task);
    setDialogOpen(true);
  }

  async function handleDelete(task: Task) {
    if (!confirm(`Delete “${task.title}”?`)) return;
    try {
      const res = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      removeTask(task.id);
      toast.success("Task deleted.");
    } catch {
      toast.error("Delete failed.");
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Tasks</h1>
          <p className="mt-2 text-muted-foreground">
            Create, prioritize, and track work with due dates and statuses.
          </p>
        </div>
        <Button onClick={openCreate} className="shrink-0 gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" />
          New task
        </Button>
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        {loading ? (
          <p className="p-10 text-center text-sm text-muted-foreground">Loading tasks…</p>
        ) : tasks.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">
            No tasks yet. Create one or use the AI planner to generate ideas.
          </p>
        ) : (
          <ScrollArea className="h-[min(70vh,640px)]">
            <div className="divide-y divide-white/10">
              {tasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex flex-col gap-4 p-5 transition-colors hover:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold leading-tight text-foreground">{task.title}</h2>
                      <StatusBadge status={task.status} />
                      <PriorityBadge priority={task.priority} />
                    </div>
                    {task.description ? (
                      <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                    ) : null}
                    <p className="text-xs text-muted-foreground">
                      {task.dueDate
                        ? `Due ${format(new Date(task.dueDate), "MMM d, yyyy")}`
                        : "No due date"}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button variant="outline" size="icon" onClick={() => openEdit(task)} aria-label="Edit">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(task)}
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <Separator className="bg-white/10" />

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        task={editing}
        onSaved={(t) => {
          if (dialogMode === "create") {
            addTask(t);
            toast.success("Task created.");
          } else {
            replaceTask(t);
            toast.success("Task updated.");
          }
        }}
      />
    </div>
  );
}
