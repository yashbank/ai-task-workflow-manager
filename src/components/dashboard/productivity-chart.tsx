"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function ProductivityChart({
  data,
}: {
  data: { label: string; count: number }[];
}) {
  return (
    <div className="glass h-[320px] w-full rounded-2xl p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Productivity</h3>
          <p className="text-sm text-muted-foreground">Tasks completed in the last 7 days</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="prodFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            width={32}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "10px",
              boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
            }}
            labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
            itemStyle={{ color: "hsl(var(--primary))" }}
          />
          <Area
            type="monotone"
            dataKey="count"
            name="Completed"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#prodFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
