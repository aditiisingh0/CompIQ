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
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold text-text-primary mb-1">
              {company.company}
            </h1>
            <p className="text-text-secondary text-sm">
              {company.count} salary record{company.count !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-text-secondary mb-1">Median TC</div>
            <div className="font-display text-3xl font-bold text-text-primary">
              {formatINR(company.median_total_compensation)}
            </div>
          </div>
        </div>
      </div>

      {/* Level Distribution */}
      <div className="mb-8 p-5 rounded-xl border border-border bg-panel">
        <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4">
          Level Distribution
        </h2>
        <div className="space-y-2.5">
          {company.level_distribution.map(({ level, count }) => (
            <div key={level} className="flex items-center gap-3">
              <span
                className={clsx(
                  "inline-flex items-center px-2 py-0.5 rounded border text-xs font-mono font-medium w-10 justify-center",
                  LEVEL_COLORS[level as Level]
                )}
              >
                {level}
              </span>
              <div className="flex-1 bg-surface rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent/60"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-sm font-mono text-text-secondary w-6 text-right">
                {count}
              </span>
            </div>
          ))}
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
              {["Role", "Level", "Location", "Exp", "Base", "Bonus", "Stock", "Total TC"].map(
                (h) => (
                  <th
                    key={h}
                    className="py-3 px-4 text-left text-xs font-medium text-subtle uppercase tracking-wider"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {company.salaries.map((s) => (
              <tr
                key={s.id}
                className="border-b border-border hover:bg-panel/50 transition-colors"
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
                <td className="py-3 px-4 text-text-secondary capitalize">
                  {s.location}
                </td>
                <td className="py-3 px-4 text-text-secondary font-mono">
                  {s.experience_years}y
                </td>
                <td className="py-3 px-4 font-mono text-text-primary">
                  {formatINR(s.base_salary)}
                </td>
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
    </div>
  );
}
