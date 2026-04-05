"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Sparkles, ListPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PriorityBadge } from "@/components/tasks/priority-badge";
import type { TaskPriority } from "@prisma/client";

type Suggestion = { title: string; description?: string; priority: TaskPriority };

export default function AiPlannerPage() {
  const router = useRouter();
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  async function runSuggest() {
    if (!goal.trim()) {
      toast.error("Describe your goal first.");
      return;
    }
    setLoading(true);
    setSuggestions([]);
    try {
      const res = await fetch("/api/ai/suggest-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: goal.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "AI request failed.");
        return;
      }
      setSuggestions(data.tasks ?? []);
      toast.success("Suggestions ready.");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function addAll() {
    if (suggestions.length === 0) return;
    setAdding(true);
    try {
      const res = await fetch("/api/tasks/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: suggestions }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Could not add tasks.");
        return;
      }
      toast.success(`Added ${data.count} tasks.`);
      router.push("/tasks");
    } catch {
      toast.error("Could not add tasks.");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">AI planner</h1>
        <p className="mt-2 text-muted-foreground">
          Describe an outcome; we will propose concrete tasks with priorities. Review and add them in one click.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass space-y-4 rounded-2xl p-6 md:p-8"
      >
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-wider">Suggest tasks for my goal</span>
        </div>
        <div className="space-y-2">
          <Label htmlFor="goal">Your goal</Label>
          <Textarea
            id="goal"
            rows={4}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. Launch a landing page for my product in two weeks, including copy, design, and analytics."
            className="resize-none bg-white/5 text-base"
          />
        </div>
        <Button onClick={runSuggest} disabled={loading} className="gap-2 shadow-lg shadow-primary/15">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "Generating…" : "Generate tasks"}
        </Button>
      </motion.div>

      {suggestions.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl p-6 md:p-8"
        >
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold">Suggested tasks</h2>
            <Button variant="secondary" onClick={addAll} disabled={adding} className="gap-2">
              {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <ListPlus className="h-4 w-4" />}
              Add all to my tasks
            </Button>
          </div>
          <ScrollArea className="h-[min(50vh,420px)] pr-3">
            <ul className="space-y-4">
              {suggestions.map((s, i) => (
                <li
                  key={`${s.title}-${i}`}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-medium leading-snug">{s.title}</p>
                    <PriorityBadge priority={s.priority} />
                  </div>
                  {s.description ? (
                    <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </motion.div>
      ) : null}
    </div>
  );
}
