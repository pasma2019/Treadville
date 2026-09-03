import Link from "next/link";
import { Coffee, Leaf, Package, Wheat } from "lucide-react";

type Category = {
  slug: string;
  name: string;
  descriptor: string;
  Icon: React.ElementType;
  tint: string;
};

const categories: Category[] = [
  {
    slug: "coffee",
    name: "Coffee",
    descriptor: "Rich. Aromatic. Distinctly Kenyan.",
    Icon: Coffee,
    tint: "var(--cat-coffee-base)",
  },
  {
    slug: "tea",
    name: "Tea",
    descriptor: "Mist. Bloom. Highland-grown.",
    Icon: Leaf,
    tint: "var(--cat-tea-base)",
  },
  {
    slug: "horticulture",
    name: "Horticulture",
    descriptor: "Crisp. Fresh. Field-to-fork.",
    Icon: Package,
    tint: "var(--cat-hort-base)",
  },
  {
    slug: "grains",
    name: "Grains",
    descriptor: "Sun-warmed. Hearty. Naturally sweet.",
    Icon: Wheat,
    tint: "var(--cat-grains-base)",
  },
];

export default function CategoryQuickNav() {
  return (
    <section
      aria-label="Quick category navigation"
      className="relative border-b border-[var(--line)] px-6 py-8 md:py-12"
    >
      <div className="mx-auto max-w-[var(--content-wide)]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {categories.map((cat, i) => (
            <CategoryNavCard key={cat.slug} cat={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryNavCard({ cat, index }: { cat: Category; index: number }) {
  const delay = index * 100;
  return (
    <Link
      href={`/shop/${cat.slug}`}
      className="group flex items-start gap-4 rounded-sm border p-4 sm:p-5 transition-all duration-[600ms] ease-[var(--ease-out)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift-light)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      style={{
        borderColor: "rgba(236,227,206,0.20)",
        background: `rgba(255,255,255,0.02)`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      aria-label={`Browse ${cat.name} products`}
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border font-display text-[14px] font-medium transition-all duration-[600ms] ease-[var(--ease-out)] group-hover:scale-[1.08] motion-reduce:transition-none motion-reduce:hover:scale-100"
        style={{
          borderColor: cat.tint,
          background: `${cat.tint}15`,
          color: "var(--ink)",
        }}
      >
        <cat.Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="font-display text-sm font-medium text-[var(--ink)] leading-tight"
          style={{ transitionDelay: `${delay}ms` }}
        >
          {cat.name}
        </p>
        <p
          className="mt-1 text-xs text-[var(--ink-muted)] leading-tight"
          style={{ transitionDelay: `${delay + 50}ms` }}
        >
          {cat.descriptor}
        </p>
        <div
          className="mt-2 h-px w-4 transition-all duration-[600ms] ease-[var(--ease-out)] group-hover:w-6 motion-reduce:transition-none motion-reduce:hover:w-4"
          style={{ background: cat.tint }}
        />
      </div>
    </Link>
  );
}