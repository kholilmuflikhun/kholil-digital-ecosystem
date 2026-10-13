"use client";

import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { formatCompact } from "@/lib/utils";

const COLORS = [1, 2, 3, 4, 5, 6].map((n) => `hsl(var(--chart-${n}))`);

const tooltipStyle = {
  contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))", fontSize: 12 },
  labelStyle: { color: "hsl(var(--foreground))" },
  itemStyle: { color: "hsl(var(--foreground))" },
} as const;

const axis = { fontSize: 11, fill: "hsl(var(--muted-foreground))" };

export function TrendChart({ data, series, height = 240 }: {
  data: Record<string, string | number>[];
  series: { key: string; label: string }[];
  height?: number;
}) {
  return (
    <div style={{ height }} role="img" aria-label="Grafik tren">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.4} />
          <XAxis dataKey="month" tick={axis} tickLine={false} axisLine={false} />
          <YAxis tick={axis} tickLine={false} axisLine={false} tickFormatter={(v) => formatCompact(v)} width={48} />
          <Tooltip {...tooltipStyle} formatter={(v: number) => formatCompact(v)} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {series.map((s, i) => (
            <Area key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.12} strokeWidth={2} />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarList({ data, height = 240 }: { data: { name: string; value: number }[]; height?: number }) {
  return (
    <div style={{ height: Math.max(height, data.length * 36) }} role="img" aria-label="Grafik batang">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.4} />
          <XAxis type="number" tick={axis} tickLine={false} axisLine={false} tickFormatter={(v) => formatCompact(v)} />
          <YAxis type="category" dataKey="name" tick={axis} tickLine={false} axisLine={false} width={120} />
          <Tooltip {...tooltipStyle} formatter={(v: number) => formatCompact(v)} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ActivityChart({ data, height = 200 }: { data: Record<string, string | number>[]; height?: number }) {
  return (
    <div style={{ height }} role="img" aria-label="Grafik aktivitas 7 hari">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.4} />
          <XAxis dataKey="day" tick={axis} tickLine={false} axisLine={false} />
          <YAxis tick={axis} tickLine={false} axisLine={false} width={28} allowDecimals={false} />
          <Tooltip {...tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="contacted" name="Prospek dihubungi" stroke={COLORS[0]} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="followUps" name="Follow-up" stroke={COLORS[1]} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="proposals" name="Proposal" stroke={COLORS[2]} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
