import type { Project } from "@/content";

type Variant = NonNullable<Project["art"]>["variant"];

const labels: Record<Variant, string> = {
  packaging: "Ilustrasi konsep kemasan",
  identity: "Ilustrasi konsep identitas visual",
  social: "Ilustrasi konsep grid media sosial",
  apparel: "Ilustrasi konsep apparel",
  web: "Ilustrasi konsep halaman web",
  system: "Ilustrasi konsep dashboard sistem",
};

/**
 * Ilustrasi prosedural geometris untuk proyek yang belum punya aset asli.
 * Ini BUKAN hasil karya klien; kartu dan halaman proyek tetap berlabel jenis proyeknya.
 */
export function ProjectArt({ variant, className = "" }: { variant: Variant; className?: string }) {
  return (
    <svg
      role="img"
      aria-label={labels[variant]}
      viewBox="0 0 320 200"
      className={`block h-full w-full ${className}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="320" height="200" fill="hsl(var(--muted))" />
      <g>{shapes[variant]}</g>
    </svg>
  );
}

const C = "hsl(var(--primary))";
const M = "hsl(var(--primary) / 0.45)";
const I = "hsl(var(--foreground))";

const shapes: Record<Variant, React.ReactNode> = {
  packaging: (
    <>
      <rect x="110" y="40" width="100" height="130" rx="6" fill={C} />
      <rect x="125" y="62" width="100" height="108" rx="6" fill={M} opacity="0.9" />
      <rect x="95" y="28" width="130" height="18" rx="4" fill={I} opacity="0.85" />
    </>
  ),
  identity: (
    <>
      <circle cx="130" cy="100" r="52" fill={C} />
      <circle cx="190" cy="100" r="52" fill={M} />
      <rect x="40" y="168" width="240" height="4" fill={I} opacity="0.8" />
    </>
  ),
  social: (
    <>
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <rect key={`${r}${c}`} x={80 + c * 52} y={24 + r * 52} width="46" height="46" fill={(r + c) % 2 ? M : C} opacity={0.55 + ((r * 3 + c) % 3) * 0.2} />
        )),
      )}
    </>
  ),
  apparel: (
    <>
      <path d="M110 40 L140 30 Q160 50 180 30 L210 40 L240 78 L212 94 L204 82 V170 H116 V82 L108 94 L80 78 Z" fill={C} />
      <circle cx="160" cy="112" r="24" fill={M} />
    </>
  ),
  web: (
    <>
      <rect x="50" y="30" width="220" height="140" rx="6" fill="none" stroke={I} strokeWidth="3" />
      <rect x="50" y="30" width="220" height="20" fill={I} opacity="0.85" />
      <rect x="70" y="66" width="110" height="14" fill={C} />
      <rect x="70" y="90" width="150" height="8" fill={I} opacity="0.5" />
      <rect x="70" y="106" width="120" height="8" fill={I} opacity="0.5" />
      <rect x="70" y="130" width="60" height="22" fill={M} />
    </>
  ),
  system: (
    <>
      <rect x="40" y="30" width="60" height="140" fill={I} opacity="0.85" />
      <rect x="112" y="30" width="80" height="52" fill={C} />
      <rect x="200" y="30" width="80" height="52" fill={M} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={112 + i * 36} y={170 - (28 + ((i * 37) % 60))} width="26" height={28 + ((i * 37) % 60)} fill={I} opacity="0.7" />
      ))}
    </>
  ),
};
