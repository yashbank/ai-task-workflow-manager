import { TaskPriority } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const styles: Record<TaskPriority, string> = {
  LOW: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  MEDIUM: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  HIGH: "border-amber-500/35 bg-amber-500/10 text-amber-200",
  URGENT: "border-rose-500/40 bg-rose-500/10 text-rose-200",
};

const labels: Record<TaskPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <Badge variant="outline" className={cn("font-medium", styles[priority])}>
      {labels[priority]}
    </Badge>
  );
}
