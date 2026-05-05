import Link from "next/link";
import { formatINR, LEVEL_COLORS, Level } from "@/lib/api";

// Per-company logo color mapping
const COMPANY_COLORS: Record<string, { bg: string; text: string }> = {
  Google:    { bg: "bg-teal-50",   text: "text-teal-800" },
  Microsoft: { bg: "bg-blue-50",   text: "text-blue-800" },
  Amazon:    { bg: "bg-amber-50",  text: "text-amber-800" },
  Meta:      { bg: "bg-purple-50", text: "text-purple-800" },
  Flipkart:  { bg: "bg-red-50",    text: "text-red-800" },
  Swiggy:    { bg: "bg-pink-50",   text: "text-pink-800" },
  Razorpay:  { bg: "bg-green-50",  text: "text-green-800" },
  Zepto:     { bg: "bg-teal-50",   text: "text-teal-800" },
};

const featuredCompanies = [
  { name: "Google",    records: 28 },
  { name: "Microsoft", records: 21 },
  { name: "Amazon",    records: 19 },
  { name: "Meta",      records: 15 },
  { name: "Flipkart",  records: 12 },
  { name: "Swiggy",    records: 9  },
  { name: "Razorpay",  records: 7  },
  { name: "Zepto",     records: 5  },
];

// Fetch with a hard 5-second timeout so build never hangs
async function fetchRecentSalaries() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(
      "https://compiq.onrender.com/api/salaries?limit=5&sort=desc",
      {
        signal: controller.signal,
        next: { revalidate: 3600 }, // cache for 1 hour
      }
    );
    clearTimeout(timeoutId);

    if (!res.ok) return { total: 0, salaries: [] };
    const data = await res.json();
    return {
      total: data.pagination?.total ?? 0,
      salaries: data.data ?? [],
    };
  } catch {
    // Backend cold start / timeout — graceful fallback
    return { total: 0, salaries: [] };
  }
}

export default async function HomePage() {
  const { total, salaries: recentSalaries } = await fetchRecentSalaries();

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="px-6 pt-20 pb-14 text-center border-b border-border">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-panel text-text-secondary text-xs font-mono mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
          Level-structured compensation data · India &amp; Global
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-4 text-text-primary">
          Know what{" "}
          <span className="text-accent">engineers</span>{" "}
          actually make
        </h1>

        <p className="text-text-secondary text-base md:text-lg max-w-lg mx-auto mb-8 leading-relaxed">
          Structured by level. Comparable by design. Real TC breakdowns —
          not vague ranges — for India's tech ecosystem.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <Link
            href="/salaries"
            className="px-7 py-3 rounded-xl bg-accent text-white font-medium text-sm hover:bg-accent/90 transition-colors"
          >
            Browse Salaries →
          </Link>
          <Link
            href="/submit"
            className="px-7 py-3 rounded-xl border border-border text-text-secondary font-medium text-sm hover:border-accent/40 hover:text-text-primary transition-colors"
          >
            Submit Your Salary
          </Link>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
          {[
            { label: "Salary records", value: total > 0 ? `${total.toLocaleString()}+` : "39+" },
            { label: "Level system",   value: "L3 → L8" },
            { label: "TC breakdown",   value: "3-part" },
          ].map(({ label, value }) => (
            <div key={label} className="p-4 rounded-xl border border-border bg-panel text-center">
              <div className="font-display text-xl font-bold text-text-primary">{value}</div>
              <div className="text-xs text-text-secondary mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Browse by Company ── */}
      <section className="px-6 py-10 border-b border-border">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-bold text-text-primary">Browse by company</h2>
          <Link href="/salaries" className="text-accent text-sm hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {featuredCompanies.map((c) => {
            const colors = COMPANY_COLORS[c.name] ?? { bg: "bg-panel", text: "text-text-primary" };
            return (
              <Link
                key={c.name}
                href={`/company/${c.name.toLowerCase()}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-border bg-panel hover:border-accent/40 transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium flex-shrink-0 ${colors.bg} ${colors.text}`}>
                  {c.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-text-primary truncate">{c.name}</div>
                  <div className="text-xs text-text-secondary">{c.records} records</div>
                </div>
              </Link>
            );
          })}
          <Link
            href="/salaries"
            className="flex items-center justify-center p-3 rounded-xl border border-dashed border-border text-text-secondary text-sm hover:text-accent hover:border-accent/40 transition-colors"
          >
            View all →
          </Link>
        </div>
      </section>

      {/* ── Recently Added ── */}
      {recentSalaries.length > 0 && (
        <section className="px-6 py-10 border-b border-border">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold text-text-primary">Recently added</h2>
            <Link href="/salaries" className="text-accent text-sm hover:underline">View all →</Link>
          </div>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-panel">
                  {["Company", "Role", "Level", "Location", "Base", "Total TC"].map((h) => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-medium text-subtle uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentSalaries.map((s: any) => (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-panel/50 transition-colors">
                    <td className="py-3 px-4">
                      <Link href={`/company/${s.company.toLowerCase()}`} className="font-medium text-text-primary hover:text-accent transition-colors">
                        {s.company}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-text-secondary">{s.role}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-mono font-medium ${LEVEL_COLORS[s.level as Level]}`}>
                        {s.level}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-secondary capitalize">{s.location}</td>
                    <td className="py-3 px-4 font-mono text-text-primary">{formatINR(s.base_salary)}</td>
                    <td className="py-3 px-4 font-mono font-bold text-accent">{formatINR(s.total_compensation)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── Why Levels Matter ── */}
      <section className="px-6 py-12 border-b border-border">
        <h2 className="font-display text-xl font-bold text-center mb-8 text-text-primary">
          Why <span className="text-accent">levels</span> change everything
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              bg: "bg-teal-950",
              title: "Same title ≠ same pay",
              body: '"Senior Engineer" could be L5 at one company and L6 at another. Title-only data is meaningless.',
            },
            {
              bg: "bg-blue-950",
              title: "TC = Base + Bonus + Stock",
              body: "We capture the full picture. Stock vesting and bonuses can double your effective salary.",
            },
            {
              bg: "bg-purple-950",
              title: "Real comparability",
              body: "Compare L5 at Google vs L5 at Flipkart — apples to apples, not guesswork.",
            },
          ].map(({ bg, title, body }) => (
            <div key={title} className="p-5 rounded-xl border border-border bg-panel hover:border-accent/30 transition-colors">
              <div className={`w-8 h-8 rounded-lg ${bg} mb-4`} />
              <h3 className="font-semibold text-text-primary text-sm mb-2">{title}</h3>
              <p className="text-text-secondary text-xs leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-12">
        <div className="text-center p-10 rounded-2xl bg-surface border border-border">
          <h2 className="font-display text-xl font-bold text-text-primary mb-2">Know your worth</h2>
          <p className="text-text-secondary text-sm mb-6 max-w-sm mx-auto leading-relaxed">
            Submit your salary anonymously and help others make better career decisions.
          </p>
          <Link
            href="/submit"
            className="inline-flex px-6 py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            Submit your salary →
          </Link>
        </div>
      </section>

    </div>
  );
}