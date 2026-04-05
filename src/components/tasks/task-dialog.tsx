"use client";

import { useEffect, useState } from "react";
import type { Task } from "@prisma/client";
import { TaskPriority, TaskStatus } from "@prisma/client";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Mode = "create" | "edit";

export function TaskDialog({
  open,
  onOpenChange,
  mode,
  task,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: Mode;
  task: Task | null;
  onSaved: (task: Task) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && task) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(task.dueDate ? format(task.dueDate, "yyyy-MM-dd") : "");
    } else {
      setTitle("");
      setDescription("");
      setStatus(TaskStatus.TODO);
      setPriority(TaskPriority.MEDIUM);
      setDueDate("");
    }
  }, [open, mode, task]);

  async function submit() {
    if (!title.trim()) return;
    setLoading(true);
    try {
      if (mode === "create") {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim() || undefined,
            status,
            priority,
            dueDate: dueDate || undefined,
          }),
        });
        if (!res.ok) throw new Error("Failed");
        const created = (await res.json()) as Task;
        onSaved(created);
      } else if (task) {
        const res = await fetch(`/api/tasks/${task.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim() || null,
            status,
            priority,
            dueDate: dueDate || null,
          }),
        });
        if (!res.ok) throw new Error("Failed");
        const updated = (await res.json()) as Task;
        onSaved(updated);
      }
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-white/10 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "New task" : "Edit task"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="bg-white/5"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Optional details"
              className="resize-none bg-white/5"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger className="bg-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TaskStatus.TODO}>To do</SelectItem>
                  <SelectItem value={TaskStatus.IN_PROGRESS}>In progress</SelectItem>
                  <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger className="bg-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                  <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
                  <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
                  <SelectItem value={TaskPriority.URGENT}>Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="due">Due date</Label>
            <Input
              id="due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-white/5"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={loading || !title.trim()}>
            {loading ? "Saving…" : mode === "create" ? "Create" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
