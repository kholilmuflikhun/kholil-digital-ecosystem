import { Code2, LayoutDashboard, Palette, Target, type LucideIcon } from "lucide-react";

const icons: LucideIcon[] = [Target, Palette, Code2, LayoutDashboard];

type Item = { id: string; name: string; tagline: string };

/** Panel ringkas empat bidang kerja di hero. Isi diambil dari konten, bukan angka atau klaim hasil. */
export function HeroPanel({ items, label = "Empat bidang kerja yang saling terhubung" }: { items: Item[]; label?: string }) {
  return (
    <div role="group" aria-label={label} className="surface relative p-2 shadow-lift">
      <ul className="divide-y divide-border">
        {items.slice(0, 4).map((item, i) => {
          const Icon = icons[i % icons.length]!;
          return (
            <li key={item.id} className="flex items-start gap-4 p-4">
              <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon aria-hidden="true" size={20} />
              </span>
              <span>
                <span className="block font-semibold">{item.name}</span>
                <span className="mt-0.5 block text-sm text-muted-foreground">{item.tagline}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
