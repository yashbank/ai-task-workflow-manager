import Link from "next/link";
import { ArrowRight, KanbanSquare, Sparkles, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="mesh-bg relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(45,212,191,0.12),_transparent_50%)]" />
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-sm font-bold text-primary">
            AI
          </span>
          <span className="text-sm font-semibold tracking-tight">Task &amp; Workflow</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild className="shadow-lg shadow-primary/20">
            <Link href="/register">Get started</Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-8 md:pt-16">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">SaaS productivity</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-6xl md:leading-[1.05]">
            AI Task &amp;{" "}
            <span className="bg-gradient-to-r from-primary via-teal-200 to-accent bg-clip-text text-transparent">
              Workflow Manager
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            Plan with AI, execute on a glassmorphism Kanban board, and ship with clarity. Built for teams who want a
            premium dark experience without the clutter.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button size="lg" asChild className="gap-2 shadow-xl shadow-primary/25">
              <Link href="/register">
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white/15 bg-white/5">
              <Link href="/login">I have an account</Link>
            </Button>
          </div>
        </div>

        <div className="mt-20 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: "AI task suggestions",
              body: "Turn goals into prioritized tasks in seconds with structured JSON output.",
            },
            {
              icon: KanbanSquare,
              title: "Drag-and-drop Kanban",
              body: "Move work across Todo, In Progress, and Done with smooth, tactile interactions.",
            },
            {
              icon: Shield,
              title: "Secure sessions",
              body: "Credential auth with hashed passwords and JWT sessions via NextAuth.",
            },
          ].map((item, i) => (
            <div
              key={item.title}
              className="glass rounded-2xl p-6 transition-transform hover:-translate-y-0.5 hover:border-white/20"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <item.icon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
