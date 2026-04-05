"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  delay = 0,
  className,
}: {
  title: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "glass rounded-2xl p-6 transition-shadow hover:shadow-lg hover:shadow-primary/5",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        <div className="rounded-xl bg-primary/10 p-3 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
