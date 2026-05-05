import Link from "next/link";
import { fetchSalaries, formatINR } from "@/lib/api";

export default async function HomePage() {
  let stats = { total: 0 };
  let recentSalaries: any[] = [];
  let topCompanies: string[] = [];

  try {
    const data = await fetchSalaries({ limit: 5, sort: "desc" });
    stats.total = data.pagination.total;
    recentSalaries = data.data;
    // unique companies
    const seen = new Set<string>();
    data.data.forEach((s) => seen.add(s.company));
    topCompanies = Array.from(seen);
  } catch {}

  // Top companies from seed data
  const featuredCompanies = [
    "Google", "Microsoft", "Amazon", "Meta",
    "Flipkart", "Swiggy", "Razorpay", "Zepto",
  ];

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
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-16">
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
            ecosystem and beyond. No vague ranges — real TC breakdowns.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/salaries"
              className="px-8 py-3.5 rounded-lg bg-accent hover:bg-accent/90 text-white font-medium text-base transition-all hover:shadow-lg hover:shadow-accent/25"
            >
              Browse Salaries →
            </Link>
            <Link
              href="/submit"
              className="px-8 py-3.5 rounded-lg border border-border hover:border-accent/40 text-text-secondary hover:text-text-primary font-medium text-base transition-all"
            >
              Submit Your Salary
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative mt-16 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            { label: "Salary Records", value: stats.total > 0 ? stats.total.toLocaleString() : "39+" },
            { label: "Level System", value: "L3 → L8" },
            { label: "TC Breakdown", value: "Base+Bonus+Stock" },
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

      {/* Featured Companies */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-border">
        <h2 className="font-display text-xl font-bold mb-6 text-text-primary">
          Browse by Company
        </h2>
        <div className="flex flex-wrap gap-3">
          {featuredCompanies.map((company) => (
            <Link
              key={company}
              href={`/company/${company.toLowerCase()}`}
              className="px-4 py-2 rounded-lg border border-border bg-panel hover:border-accent/40 hover:text-accent text-text-secondary text-sm font-medium transition-all"
            >
              {company}
            </Link>
          ))}
          <Link
            href="/salaries"
            className="px-4 py-2 rounded-lg border border-dashed border-border text-text-secondary text-sm hover:text-accent transition-colors"
          >
            View all →
          </Link>
        </div>
      </section>

      {/* Recent Salaries */}
      {recentSalaries.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12 border-t border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-text-primary">
              Recently Added
            </h2>
            <Link href="/salaries" className="text-accent text-sm hover:underline">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-panel">
                  {["Company", "Role", "Level", "Location", "Total TC"].map((h) => (
                    <th key={h} className="py-3 px-4 text-left text-xs font-medium text-subtle uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentSalaries.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-panel/50 transition-colors">
                    <td className="py-3 px-4">
                      <Link
                        href={`/company/${s.company.toLowerCase()}`}
                        className="font-medium text-text-primary hover:text-accent transition-colors"
                      >
                        {s.company}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-text-secondary">{s.role}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded border text-xs font-mono font-medium bg-accent/10 text-accent border-accent/20">
                        {s.level}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-secondary">{s.location}</td>
                    <td className="py-3 px-4 font-mono font-bold text-text-primary">
                      {formatINR(s.total_compensation)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Why levels matter */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-border">
        <h2 className="font-display text-2xl font-bold mb-10 text-center">
          Why <span className="text-accent">levels</span> change everything
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
              className="p-6 rounded-xl border border-border bg-panel hover:border-accent/30 transition-colors"
            >
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-semibold text-text-primary mb-2">{title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-border">
        <div className="text-center p-10 rounded-2xl border border-accent/20 bg-accent/5">
          <h2 className="font-display text-2xl font-bold text-text-primary mb-3">
            Know your worth
          </h2>
          <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
            Submit your salary anonymously and help others make better career decisions.
          </p>
          <Link
            href="/submit"
            className="inline-flex px-6 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-colors"
          >
            Submit Your Salary →
          </Link>
        </div>
      </section>
    </div>
  );
}