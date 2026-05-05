import { formatINR, LEVEL_COLORS, Level } from "@/lib/api";
import Link from "next/link";
import clsx from "clsx";
import { notFound } from "next/navigation";

// Never pre-render at build time — always fetch at request time
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface PageProps {
  params: { slug: string };
}

// Maps each level to a color pill style
const LEVEL_PILL: Record<string, string> = {
  L3: "bg-teal-900 text-teal-300 border-teal-700",
  L4: "bg-blue-900 text-blue-300 border-blue-700",
  L5: "bg-amber-900 text-amber-300 border-amber-700",
  L6: "bg-purple-900 text-purple-300 border-purple-700",
  L7: "bg-red-900 text-red-300 border-red-700",
};

function LevelPill({ level }: { level: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center px-2 py-0.5 rounded-md border text-xs font-mono font-medium",
        LEVEL_PILL[level] ?? LEVEL_COLORS[level as Level]
      )}
    >
      {level}
    </span>
  );
}

async function fetchCompanyWithTimeout(slug: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(
      `https://compiq.onrender.com/company/${encodeURIComponent(slug)}`,
      { signal: controller.signal, cache: "no-store" }
    );
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

export default async function CompanyPage({ params }: PageProps) {
  const company = await fetchCompanyWithTimeout(decodeURIComponent(params.slug));
  if (!company) notFound();

  const maxCount = Math.max(...company.level_distribution.map((l: any) => l.count));

  const avgBase  = Math.round(company.salaries.reduce((s: number, r: any) => s + r.base_salary, 0) / company.salaries.length);
  const avgBonus = Math.round(company.salaries.reduce((s: number, r: any) => s + r.bonus, 0) / company.salaries.length);
  const avgStock = Math.round(company.salaries.reduce((s: number, r: any) => s + r.stock, 0) / company.salaries.length);
  const maxTC    = Math.max(...company.salaries.map((s: any) => s.total_compensation));
  const minTC    = Math.min(...company.salaries.map((s: any) => s.total_compensation));
  const totalAvg = avgBase + avgBonus + avgStock;

  const basePct  = Math.round((avgBase  / totalAvg) * 100);
  const bonusPct = Math.round((avgBonus / totalAvg) * 100);
  const stockPct = Math.round((avgStock / totalAvg) * 100);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 text-xs text-text-secondary mb-6">
        <Link href="/salaries" className="hover:text-text-primary transition-colors">
          Salaries
        </Link>
        <span className="opacity-40">/</span>
        <span className="text-text-primary">{company.company}</span>
      </div>

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center text-xl font-bold text-accent flex-shrink-0">
            {company.company[0]}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-display text-2xl font-bold text-text-primary">
                {company.company}
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent-green/10 text-accent-green border border-accent-green/20">
                Verified
              </span>
            </div>
            <p className="text-xs text-text-secondary flex items-center gap-2">
              <span>{company.count} salary record{company.count !== 1 ? "s" : ""}</span>
              <span className="opacity-40">·</span>
              <span>Updated recently</span>
            </p>
          </div>
        </div>
        <Link
          href="/submit"
          className="px-4 py-2 rounded-xl border border-accent/40 text-accent text-sm font-medium hover:bg-accent/5 transition-colors"
        >
          + Add Salary
        </Link>
      </div>

      {/* ── TC Stats Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { label: "Median TC", value: formatINR(company.median_total_compensation), sub: "total comp / year", highlight: true },
          { label: "Avg Base",  value: formatINR(avgBase),  sub: "per year" },
          { label: "Avg Bonus", value: formatINR(avgBonus), sub: "per year" },
          { label: "Avg Stock", value: formatINR(avgStock), sub: "per year" },
        ].map(({ label, value, sub, highlight }) => (
          <div
            key={label}
            className={clsx(
              "p-4 rounded-xl",
              highlight
                ? "bg-accent/10 border border-accent/20"
                : "bg-panel border border-border"
            )}
          >
            <div className={clsx("text-xs uppercase tracking-wider mb-1", highlight ? "text-accent" : "text-text-secondary")}>
              {label}
            </div>
            <div className={clsx("font-display text-xl font-bold", highlight ? "text-accent" : "text-text-primary")}>
              {value}
            </div>
            <div className="text-xs text-text-secondary mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* ── TC Range Bar ── */}
      <div className="mb-6 p-4 rounded-xl border border-border bg-panel flex items-center gap-6 flex-wrap">
        <div className="flex gap-6">
          <div>
            <div className="text-xs text-text-secondary mb-0.5">Min TC</div>
            <div className="text-sm font-medium text-text-primary font-mono">{formatINR(minTC)}</div>
          </div>
          <div>
            <div className="text-xs text-text-secondary mb-0.5">Max TC</div>
            <div className="text-sm font-medium text-text-primary font-mono">{formatINR(maxTC)}</div>
          </div>
        </div>
        <div className="flex-1 min-w-32">
          <div className="h-1.5 bg-surface rounded-full overflow-hidden">
            <div className="h-full w-full rounded-full bg-accent" />
          </div>
          <div className="flex justify-between mt-1.5 text-xs text-text-secondary">
            <span>{formatINR(minTC)}</span>
            <span>{formatINR(maxTC)}</span>
          </div>
        </div>
      </div>

      {/* ── Compensation Breakdown ── */}
      <h2 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">
        Compensation breakdown
      </h2>
      <div className="p-5 rounded-xl border border-border bg-panel mb-6 space-y-3">
        {[
          { label: "Base",  pct: basePct,  value: formatINR(avgBase),  color: "bg-accent" },
          { label: "Bonus", pct: bonusPct, value: formatINR(avgBonus), color: "bg-blue-400" },
          { label: "Stock", pct: stockPct, value: formatINR(avgStock), color: "bg-amber-400" },
        ].map(({ label, pct, value, color }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-xs text-text-secondary w-12 flex-shrink-0">{label}</span>
            <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
              <div className={clsx("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs font-medium text-text-primary min-w-24 text-right">
              {value} <span className="text-text-secondary font-normal">{pct}%</span>
            </span>
          </div>
        ))}
      </div>

      {/* ── Level Distribution ── */}
      <h2 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">
        Level distribution
      </h2>
      <div className="p-5 rounded-xl border border-border bg-panel mb-6 space-y-3">
        {company.level_distribution.map(({ level, count }: any) => {
          const levelSalaries = company.salaries.filter((s: any) => s.level === level);
          const levelAvg = levelSalaries.length > 0
            ? Math.round(levelSalaries.reduce((s: number, r: any) => s + r.total_compensation, 0) / levelSalaries.length)
            : 0;
          return (
            <div key={level} className="flex items-center gap-3">
              <LevelPill level={level} />
              <div className="flex-1 bg-surface rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent/60 transition-all"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-xs font-mono text-text-secondary w-5 text-right flex-shrink-0">
                {count}
              </span>
              {levelAvg > 0 && (
                <span className="text-xs font-mono text-text-secondary w-20 text-right flex-shrink-0">
                  {formatINR(levelAvg)} avg
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Salary Table ── */}
      <h2 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">
        All salary records
      </h2>
      <div className="overflow-x-auto rounded-xl border border-border mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-panel">
              {["Role", "Level", "Location", "Exp", "Base", "Bonus", "Stock", "Total TC"].map((h) => (
                <th
                  key={h}
                  className="py-3 px-4 text-left text-xs font-medium text-subtle uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {company.salaries.map((s: any) => (
              <tr
                key={s.id}
                className="border-b border-border last:border-0 hover:bg-panel/60 transition-colors"
              >
                <td className="py-3 px-4 font-medium text-text-primary whitespace-nowrap">{s.role}</td>
                <td className="py-3 px-4">
                  <LevelPill level={s.level} />
                </td>
                <td className="py-3 px-4 text-text-secondary capitalize">{s.location}</td>
                <td className="py-3 px-4">
                  <span className="bg-surface border border-border rounded-md px-1.5 py-0.5 text-xs font-mono text-text-secondary">
                    {s.experience_years}y
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-text-primary">{formatINR(s.base_salary)}</td>
                <td className="py-3 px-4 font-mono text-blue-400">
                  {s.bonus > 0 ? formatINR(s.bonus) : <span className="opacity-20">—</span>}
                </td>
                <td className="py-3 px-4 font-mono text-amber-400">
                  {s.stock > 0 ? formatINR(s.stock) : <span className="opacity-20">—</span>}
                </td>
                <td className="py-3 px-4 font-mono font-bold text-accent">
                  {formatINR(s.total_compensation)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Bottom CTAs ── */}
      <div className="flex items-center justify-center gap-3">
        <Link
          href="/compare"
          className="px-5 py-2.5 rounded-xl border border-border hover:border-accent/40 text-text-secondary hover:text-accent text-sm font-medium transition-all"
        >
          Compare salaries →
        </Link>
        <Link
          href="/submit"
          className="px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          + Add your salary
        </Link>
      </div>

    </div>
  );
}