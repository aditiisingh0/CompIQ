import Link from "next/link";
import { fetchSalaries, formatINR } from "@/lib/api";

export default async function HomePage() {
  let stats = { total: 0, companies: 0 };
  try {
    const data = await fetchSalaries({ limit: 1 });
    stats.total = data.pagination.total;
  } catch {}

  return (
    <div className="min-h-screen">
      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(124,111,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(124,111,255,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-20">
        {/* Glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-accent text-xs font-mono mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            Level-structured compensation data
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
            Know what{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #7C6FFF 0%, #FF5F6D 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              engineers
            </span>{" "}
            actually make
          </h1>

          <p className="text-text-secondary text-lg md:text-xl max-w-xl mx-auto mb-10">
            Structured by level. Comparable by design. Built for India's tech
            ecosystem and beyond. No vague ranges.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/salaries"
              className="px-8 py-3.5 rounded-lg bg-accent hover:bg-accent/90 text-white font-medium text-base transition-all hover:shadow-lg hover:shadow-accent/25"
            >
              Browse Salaries →
            </Link>
            <Link
              href="/compare"
              className="px-8 py-3.5 rounded-lg border border-border hover:border-accent/40 text-text-secondary hover:text-text-primary font-medium text-base transition-all"
            >
              Compare Offers
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative mt-20 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            { label: "Salary Records", value: stats.total.toLocaleString() },
            { label: "Level System", value: "L3 → L8" },
            { label: "Data Type", value: "Verified TC" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="text-center p-4 rounded-xl border border-border bg-panel"
            >
              <div className="font-display text-2xl font-bold text-text-primary">
                {value}
              </div>
              <div className="text-text-secondary text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why levels matter */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-border">
        <h2 className="font-display text-2xl font-bold mb-10 text-center">
          Why{" "}
          <span className="text-accent">levels</span> change everything
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: "⚡",
              title: "Same title ≠ Same pay",
              body: 'A "Senior Engineer" at one company may be L5. At another, L6. Title-only data is meaningless.',
            },
            {
              icon: "🎯",
              title: "TC = Base + Bonus + Stock",
              body: "We capture the full picture. Stock vesting and bonuses can double your effective salary.",
            },
            {
              icon: "⚖️",
              title: "Real comparability",
              body: "Compare L5 at Google vs L5 at Flipkart. Apples to apples, not guesswork.",
            },
          ].map(({ icon, title, body }) => (
            <div
              key={title}
              className="p-6 rounded-xl border border-border bg-panel hover:border-accent/30 transition-colors group"
            >
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-semibold text-text-primary mb-2">{title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
