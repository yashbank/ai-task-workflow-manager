import { TaskStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const styles: Record<TaskStatus, string> = {
  TODO: "border-white/15 bg-white/5 text-muted-foreground",
  IN_PROGRESS: "border-primary/35 bg-primary/10 text-primary",
  DONE: "border-emerald-500/35 bg-emerald-500/10 text-emerald-300",
};

const labels: Record<TaskStatus, string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  DONE: "Done",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <Badge variant="outline" className={cn("font-medium", styles[status])}>
      {labels[status]}
    </Badge>
  );
}
