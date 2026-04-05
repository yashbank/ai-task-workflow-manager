"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  ListChecks,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = {
  list: ListChecks,
  check: CheckCircle2,
  progress: CircleDashed,
  alert: AlertTriangle,
};

export function StatCard({
  title,
  value,
  hint,
  icon,
  delay = 0,
  className,
}: {
  title: string;
  value: string | number;
  hint?: string;
  icon: keyof typeof icons;
  delay?: number;
  className?: string;
}) {
  const Icon = icons[icon] ?? ListChecks;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "glass rounded-lg border border-border/80 p-6 transition-shadow hover:shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        <div className="rounded-lg bg-primary/10 p-3 text-primary">
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </div>
      </div>
    </motion.div>
  );
}
