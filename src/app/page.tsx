import Link from "next/link";
import { ArrowRight, KanbanSquare, LayoutGrid, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="mesh-bg relative min-h-screen overflow-hidden">
      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-10">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/12 text-xs font-semibold tracking-tight text-primary">
            TW
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground">Task Workspace</span>
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
          <Link href="/dashboard">Open app</Link>
        </Button>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-4 md:pt-12">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Productivity</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-foreground md:text-5xl">
            Calm, minimal task management
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            Dashboard, list, and Kanban in one place. Built for focus — no clutter.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button size="lg" asChild className="rounded-md px-6 font-medium">
              <Link href="/dashboard" className="gap-2">
                View UI <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-md border-border/80 bg-transparent">
              <Link href="/kanban">Kanban</Link>
            </Button>
          </div>
        </div>

        <div className="mt-20 grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: LayoutGrid,
              title: "Dashboard",
              body: "Overview and trends at a glance.",
            },
            {
              icon: KanbanSquare,
              title: "Board",
              body: "Drag work across columns with clarity.",
            },
            {
              icon: Sparkles,
              title: "AI",
              body: "Optional suggestions when you connect an API key.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="glass rounded-lg border border-border/80 bg-card/30 p-5 transition-colors hover:border-border"
            >
              <item.icon className="h-5 w-5 text-primary opacity-90" strokeWidth={1.5} />
              <h3 className="mt-4 text-sm font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
