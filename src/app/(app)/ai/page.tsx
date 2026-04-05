"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Sparkles, ListPlus } from "lucide-react";
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
  const [hint, setHint] = useState<string | null>(null);

  async function runSuggest() {
    setHint(null);
    if (!goal.trim()) {
      setHint("Add a short description of your goal.");
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
        setHint(
          typeof data.error === "string"
            ? data.error
            : "AI is unavailable. Add OPENAI_API_KEY in your environment to enable this feature."
        );
        return;
      }
      setSuggestions(data.tasks ?? []);
    } catch {
      setHint("Request could not be completed. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  async function addAll() {
    if (suggestions.length === 0) return;
    setHint(null);
    setAdding(true);
    try {
      const res = await fetch("/api/tasks/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: suggestions }),
      });
      const data = await res.json();
      if (!res.ok) {
        setHint(typeof data.error === "string" ? data.error : "Could not add tasks.");
        return;
      }
      router.push("/tasks");
    } catch {
      setHint("Could not add tasks.");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">AI planner</h1>
        <p className="mt-2 text-muted-foreground">
          Describe an outcome; optional AI suggestions when an API key is configured.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass space-y-4 rounded-lg border border-border/80 p-6 md:p-8"
      >
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5 opacity-90" strokeWidth={1.5} />
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Goal
          </span>
        </div>
        <div className="space-y-2">
          <Label htmlFor="goal">Your goal</Label>
          <Textarea
            id="goal"
            rows={4}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. Ship a landing page in two weeks."
            className="resize-none border-border/80 bg-muted/20 text-base"
          />
        </div>
        {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
        <Button onClick={runSuggest} disabled={loading} className="gap-2 rounded-md font-medium">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "Generating…" : "Generate tasks"}
        </Button>
      </motion.div>

      {suggestions.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-lg border border-border/80 p-6 md:p-8"
        >
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Suggested tasks</h2>
            <Button variant="secondary" onClick={addAll} disabled={adding} className="gap-2 rounded-md">
              {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <ListPlus className="h-4 w-4" />}
              Add all to tasks
            </Button>
          </div>
          <ScrollArea className="h-[min(50vh,420px)] pr-3">
            <ul className="space-y-3">
              {suggestions.map((s, i) => (
                <li
                  key={`${s.title}-${i}`}
                  className="rounded-lg border border-border/80 bg-muted/15 p-4"
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
