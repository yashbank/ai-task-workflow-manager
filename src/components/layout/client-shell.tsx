"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ListTodo,
  KanbanSquare,
  Sparkles,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/kanban", label: "Kanban", icon: KanbanSquare },
  { href: "/ai", label: "AI Planner", icon: Sparkles },
];

export function ClientShell({
  user,
  children,
}: {
  user: { name?: string | null; email?: string | null };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="mesh-bg flex min-h-screen">
      <aside
        className={cn(
          "glass-strong fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 transition-transform md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="border-b border-white/10 px-6 py-8">
          <Link href="/dashboard" className="group flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-lg font-bold text-primary">
              AI
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight text-foreground">Task &amp; Workflow</p>
              <p className="text-xs text-muted-foreground">Manager</p>
            </div>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4">
          {nav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                <span
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4">
          <p className="truncate px-1 text-xs font-medium text-foreground">{user.name || "Account"}</p>
          <p className="mb-3 truncate px-1 text-xs text-muted-foreground">{user.email}</p>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-white/10 bg-white/5 hover:bg-white/10"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex min-h-screen flex-1 flex-col md:pl-0">
        <header className="glass sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-white/10 px-4 py-4 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-sm font-semibold">AI Task &amp; Workflow</span>
          <span className="w-10" />
        </header>
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 px-4 py-8 md:px-10 md:py-10"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
