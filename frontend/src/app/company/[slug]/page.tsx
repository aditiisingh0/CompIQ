import { fetchCompany, formatINR, LEVEL_COLORS, Level } from "@/lib/api";
import Link from "next/link";
import clsx from "clsx";
import { notFound } from "next/navigation";

interface PageProps {
  params: { slug: string };
}

export default async function CompanyPage({ params }: PageProps) {
  let company;
  try {
    company = await fetchCompany(decodeURIComponent(params.slug));
  } catch {
    notFound();
  }

  const maxCount = Math.max(...company.level_distribution.map((l) => l.count));

  // Compute averages
  const avgBase = company.salaries.reduce((s, r) => s + r.base_salary, 0) / company.salaries.length;
  const avgBonus = company.salaries.reduce((s, r) => s + r.bonus, 0) / company.salaries.length;
  const avgStock = company.salaries.reduce((s, r) => s + r.stock, 0) / company.salaries.length;
  const maxTC = Math.max(...company.salaries.map((s) => s.total_compensation));
  const minTC = Math.min(...company.salaries.map((s) => s.total_compensation));

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="text-sm text-text-secondary mb-6">
        <Link href="/salaries" className="hover:text-text-primary transition-colors">
          Salaries
        </Link>
        <span className="mx-2">/</span>
        <span className="text-text-primary">{company.company}</span>
      </div>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl font-bold text-text-primary mb-1">
            {company.company}
          </h1>
          <p className="text-text-secondary text-sm">
            {company.count} salary record{company.count !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/submit"
          className="px-4 py-2 rounded-lg border border-accent/30 text-accent text-sm font-medium hover:bg-accent/5 transition-colors"
        >
          + Add Salary
        </Link>
      </div>

      {/* TC Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Median TC", value: formatINR(company.median_total_compensation), highlight: true },
          { label: "Avg Base", value: formatINR(avgBase) },
          { label: "Avg Bonus", value: formatINR(avgBonus) },
          { label: "Avg Stock", value: formatINR(avgStock) },
        ].map(({ label, value, highlight }) => (
          <div
            key={label}
            className={clsx(
              "p-4 rounded-xl border",
              highlight
                ? "border-accent/30 bg-accent/5"
                : "border-border bg-panel"
            )}
          >
            <div className="text-xs text-text-secondary mb-1">{label}</div>
            <div className={clsx(
              "font-display text-xl font-bold",
              highlight ? "text-accent" : "text-text-primary"
            )}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* TC Range */}
      <div className="mb-8 p-4 rounded-xl border border-border bg-panel flex items-center gap-6 flex-wrap">
        <div>
          <div className="text-xs text-text-secondary mb-1">TC Range</div>
          <div className="font-mono text-sm text-text-primary font-medium">
            {formatINR(minTC)} — {formatINR(maxTC)}
          </div>
        </div>
        <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden min-w-32">
          <div className="h-full rounded-full bg-gradient-to-r from-accent/40 to-accent" style={{ width: "100%" }} />
        </div>
      </div>

      {/* Level Distribution */}
      <div className="mb-8 p-5 rounded-xl border border-border bg-panel">
        <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4">
          Level Distribution
        </h2>
        <div className="space-y-3">
          {company.level_distribution.map(({ level, count }) => {
            const levelSalaries = company.salaries.filter((s) => s.level === level);
            const levelMedian = levelSalaries.length > 0
              ? levelSalaries.reduce((s, r) => s + r.total_compensation, 0) / levelSalaries.length
              : 0;
            return (
              <div key={level} className="flex items-center gap-3">
                <span
                  className={clsx(
                    "inline-flex items-center px-2 py-0.5 rounded border text-xs font-mono font-medium w-10 justify-center flex-shrink-0",
                    LEVEL_COLORS[level as Level]
                  )}
                >
                  {level}
                </span>
                <div className="flex-1 bg-surface rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent/60 transition-all"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-text-secondary w-6 text-right flex-shrink-0">
                  {count}
                </span>
                {levelMedian > 0 && (
                  <span className="text-xs font-mono text-text-secondary w-16 text-right flex-shrink-0">
                    {formatINR(levelMedian)} avg
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Salary Table */}
      <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-3">
        All Salary Records
      </h2>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-panel">
              {["Role", "Level", "Location", "Exp", "Base", "Bonus", "Stock", "Total TC"].map((h) => (
                <th
                  key={h}
                  className="py-3 px-4 text-left text-xs font-medium text-subtle uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {company.salaries.map((s) => (
              <tr
                key={s.id}
                className="border-b border-border last:border-0 hover:bg-panel/50 transition-colors"
              >
                <td className="py-3 px-4 text-text-secondary">{s.role}</td>
                <td className="py-3 px-4">
                  <span
                    className={clsx(
                      "inline-flex items-center px-2 py-0.5 rounded border text-xs font-mono font-medium",
                      LEVEL_COLORS[s.level]
                    )}
                  >
                    {s.level}
                  </span>
                </td>
                <td className="py-3 px-4 text-text-secondary capitalize">{s.location}</td>
                <td className="py-3 px-4 text-text-secondary font-mono">{s.experience_years}y</td>
                <td className="py-3 px-4 font-mono text-text-primary">{formatINR(s.base_salary)}</td>
                <td className="py-3 px-4 font-mono text-accent-green">
                  {s.bonus > 0 ? formatINR(s.bonus) : <span className="text-muted">—</span>}
                </td>
                <td className="py-3 px-4 font-mono text-accent-amber">
                  {s.stock > 0 ? formatINR(s.stock) : <span className="text-muted">—</span>}
                </td>
                <td className="py-3 px-4 font-mono font-bold text-text-primary">
                  {formatINR(s.total_compensation)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Compare CTA */}
      <div className="mt-6 text-center">
        <Link
          href="/compare"
          className="inline-flex px-5 py-2.5 rounded-lg border border-border hover:border-accent/40 text-text-secondary hover:text-accent text-sm font-medium transition-all"
        >
          Compare these salaries →
        </Link>
      </div>
    </div>
  );
}