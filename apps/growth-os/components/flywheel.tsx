import { FLYWHEEL_STEPS } from "@/lib/constants";

/** Flywheel melingkar (SVG murni, tanpa JS). Tahap terakhir kembali memperkuat Personal Brand. */
export function Flywheel() {
  const n = FLYWHEEL_STEPS.length;
  const cx = 200, cy = 200, r = 150;
  const pts = FLYWHEEL_STEPS.map((label, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { label, x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), a };
  });

  return (
    <figure>
      <svg viewBox="0 0 400 400" role="img" aria-label="Siklus pertumbuhan bisnis dari brand personal hingga investasi ulang" className="mx-auto w-full max-w-md">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill="hsl(var(--primary))" />
          </marker>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
        {pts.map((p, i) => {
          const next = pts[(i + 1) % n];
          const mx = cx + r * Math.cos((p.a + next.a + (i === n - 1 ? Math.PI * 2 : 0)) / 2);
          const my = cy + r * Math.sin((p.a + next.a + (i === n - 1 ? Math.PI * 2 : 0)) / 2);
          const ang = Math.atan2(my - cy, mx - cx) + Math.PI / 2;
          return (
            <path
              key={`a${i}`}
              d="M-5 4L0 -4L5 4"
              transform={`translate(${mx} ${my}) rotate(${(ang * 180) / Math.PI})`}
              fill="none" stroke="hsl(var(--primary))" strokeWidth="2"
            />
          );
        })}
        {pts.map((p, i) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r="16" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fontWeight="600" fill="hsl(var(--primary))">{i + 1}</text>
          </g>
        ))}
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize="15" fontWeight="700" fill="hsl(var(--foreground))">Siklus</text>
      </svg>
      <ol className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground sm:grid-cols-3">
        {FLYWHEEL_STEPS.map((s, i) => (
          <li key={s}><span className="mr-1 font-semibold text-primary">{i + 1}.</span>{s}</li>
        ))}
        <li className="col-span-full mt-1 text-foreground">↻ Investasi ulang memperkuat brand personal</li>
      </ol>
    </figure>
  );
}
