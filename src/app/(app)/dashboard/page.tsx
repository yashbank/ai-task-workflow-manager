import { redirect } from "next/navigation";
import { TaskStatus } from "@prisma/client";
import { eachDayOfInterval, format, startOfDay, subDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import { isAuthDisabled, requireUserId } from "@/lib/session";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProductivityChart } from "@/components/dashboard/productivity-chart";

export default async function DashboardPage() {
  const userId = await requireUserId();
  if (!userId && !isAuthDisabled()) redirect("/login");

  const now = new Date();
  const weekStart = startOfDay(subDays(now, 6));

  if (!userId) {
    return (
      <div className="mx-auto max-w-6xl space-y-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Dashboard</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Connect your database to see live stats. UI preview mode is active.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <StatCard
              key={i}
              title="—"
              value="—"
              hint="Preview"
              icon="list"
              delay={i * 0.05}
            />
          ))}
        </div>
        <ProductivityChart
          data={eachDayOfInterval({ start: weekStart, end: now }).map((day) => ({
            label: format(day, "EEE"),
            count: 0,
          }))}
        />
      </div>
    );
  }

  const [total, done, inProgress, todo, overdue, completedInWeek] = await Promise.all([
    prisma.task.count({ where: { userId } }),
    prisma.task.count({ where: { userId, status: TaskStatus.DONE } }),
    prisma.task.count({ where: { userId, status: TaskStatus.IN_PROGRESS } }),
    prisma.task.count({ where: { userId, status: TaskStatus.TODO } }),
    prisma.task.count({
      where: {
        userId,
        status: { not: TaskStatus.DONE },
        dueDate: { lt: now },
      },
    }),
    prisma.task.findMany({
      where: {
        userId,
        status: TaskStatus.DONE,
        updatedAt: { gte: weekStart },
      },
      select: { updatedAt: true },
    }),
  ]);

  const days = eachDayOfInterval({ start: weekStart, end: now });
  const chartData = days.map((day) => {
    const key = format(day, "yyyy-MM-dd");
    const count = completedInWeek.filter((t) => format(t.updatedAt, "yyyy-MM-dd") === key).length;
    return {
      label: format(day, "EEE"),
      count,
    };
  });

  const rate = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Dashboard</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Overview of your workload, completion rate, and recent momentum.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total tasks"
          value={total}
          hint="Across all statuses"
          icon="list"
          delay={0}
        />
        <StatCard
          title="Completed"
          value={done}
          hint={`${rate}% completion rate`}
          icon="check"
          delay={0.05}
        />
        <StatCard
          title="In progress"
          value={inProgress}
          hint={`${todo} in backlog`}
          icon="progress"
          delay={0.1}
        />
        <StatCard
          title="Overdue"
          value={overdue}
          hint={overdue ? "Needs attention" : "You are on track"}
          icon="alert"
          delay={0.15}
          className={overdue ? "ring-1 ring-amber-500/15" : undefined}
        />
      </div>

      <ProductivityChart data={chartData} />
    </div>
  );
}
