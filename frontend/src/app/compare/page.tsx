"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { fetchCompare, fetchSalaries, CompareResponse, Salary, formatINR, formatDiff, LEVEL_COLORS, Level } from "@/lib/api";
import Link from "next/link";
import clsx from "clsx";

function DiffCell({ value }: { value: number }) {
  const isPositive = value > 0;
  const isZero = value === 0;
  return (
    <span
      className={clsx(
        "font-mono text-sm",
        isZero ? "text-text-secondary" : isPositive ? "text-accent-green" : "text-accent-hot"
      )}
    >
      {isZero ? "—" : (isPositive ? "+" : "") + formatINR(Math.abs(value)) + (value < 0 ? " less" : " more")}
    </span>
  );
}

function CompareContent() {
  const params = useSearchParams();
  const id1 = params.get("id1");
  const id2 = params.get("id2");

  const [result, setResult] = useState<CompareResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For the selector UI when no IDs provided
  const [allSalaries, setAllSalaries] = useState<Salary[]>([]);
  const [sel1, setSel1] = useState("");
  const [sel2, setSel2] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  useEffect(() => {
    setLoadingList(true);
    fetchSalaries({ limit: 100 })
      .then((r) => {
        setAllSalaries(r.data);
        setListError(null);
      })
      .catch((e) => {
        setListError("Data is Not Coming From Backend.");
        console.error("fetchSalaries error:", e);
      })
      .finally(() => setLoadingList(false));
  }, []);

  useEffect(() => {
    if (id1 && id2) {
      setLoading(true);
      fetchCompare(id1, id2)
        .then(setResult)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [id1, id2]);

  const runCompare = () => {
    if (!sel1 || !sel2) return;
    window.location.href = `/compare?id1=${sel1}&id2=${sel2}`;
  };

  const selectCls = "w-full bg-panel border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent/60 transition-colors";

  if (!id1 || !id2) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="p-6 rounded-xl border border-border bg-panel">
          <h2 className="font-semibold text-text-primary mb-4">Select two salaries to compare</h2>

          {/* Error state */}
          {listError && (
            <div className="mb-4 px-4 py-3 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-sm">
              ⚠️ {listError}
              <div className="mt-2 text-xs text-red-300/70">
                Run: <code className="bg-red-500/10 px-1 rounded">cd backend && npm run dev</code>
              </div>
            </div>
          )}

          {/* Loading state */}
          {loadingList && !listError && (
            <div className="flex items-center gap-2 text-text-secondary text-sm mb-4">
              <div className="w-4 h-4 border-2 border-accent/40 border-t-accent rounded-full animate-spin" />
              Loading salaries...
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-xs text-text-secondary mb-1 block">
                Salary A {allSalaries.length > 0 && <span className="text-accent">({allSalaries.length} available)</span>}
              </label>
              <select
                className={selectCls}
                value={sel1}
                onChange={(e) => setSel1(e.target.value)}
                disabled={loadingList || !!listError}
              >
                <option value="">{loadingList ? "Loading..." : listError ? "Backend not available" : "Choose..."}</option>
                {allSalaries.filter((s) => s.id !== sel2).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.company} · {s.role} · {s.level} · {formatINR(s.total_compensation)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Salary B</label>
              <select
                className={selectCls}
                value={sel2}
                onChange={(e) => setSel2(e.target.value)}
                disabled={loadingList || !!listError}
              >
                <option value="">{loadingList ? "Loading..." : listError ? "Backend not available" : "Choose..."}</option>
                {allSalaries.filter((s) => s.id !== sel1).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.company} · {s.role} · {s.level} · {formatINR(s.total_compensation)}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={runCompare}
              disabled={!sel1 || !sel2 || loadingList}
              className="w-full py-2.5 rounded-lg bg-accent text-white font-medium text-sm hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors mt-2"
            >
              Compare →
            </button>
          </div>
        </div>
        <p className="text-center text-text-secondary text-xs mt-4">
          Or select rows in the{" "}
          <Link href="/salaries" className="text-accent hover:underline">
            salary table
          </Link>{" "}
          to compare directly.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-20 text-text-secondary">
        <div className="w-6 h-6 border-2 border-accent/40 border-t-accent rounded-full animate-spin mx-auto mb-3" />
        Loading comparison...
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="text-center py-20 text-text-secondary">
        <p className="text-accent-hot">Failed to load comparison</p>
        <Link href="/compare" className="text-accent text-sm mt-2 block hover:underline">
          Try again
        </Link>
      </div>
    );
  }

  const { salary1: s1, salary2: s2, diff } = result;
  const levelDiff = diff.level_difference;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Level note */}
      {levelDiff !== 0 && (
        <div className="mb-5 px-4 py-3 rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-400 text-sm">
          ⚠️ These are{" "}
          <strong>different levels</strong> ({s1.level} vs {s2.level}
          ). Comparison may not be apples-to-apples.
        </div>
      )}

      {/* Side-by-side cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {[s1, s2].map((s, i) => (
          <div key={s.id} className="p-5 rounded-xl border border-border bg-panel">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-text-secondary uppercase">
                Offer {i === 0 ? "A" : "B"}
              </span>
              <span
                className={clsx(
                  "inline-flex items-center px-2 py-0.5 rounded border text-xs font-mono font-medium",
                  LEVEL_COLORS[s.level as Level]
                )}
              >
                {s.level}
              </span>
            </div>
            <Link
              href={`/company/${encodeURIComponent(s.company.toLowerCase())}`}
              className="font-display text-2xl font-bold text-text-primary hover:text-accent transition-colors"
            >
              {s.company}
            </Link>
            <p className="text-text-secondary text-sm mt-1">{s.role}</p>
            <p className="text-text-secondary text-xs mt-0.5">{s.location} · {s.experience_years}y exp</p>
            <div className="mt-4 font-display text-3xl font-bold text-text-primary">
              {formatINR(s.total_compensation)}
            </div>
            <div className="text-xs text-text-secondary mt-0.5">Total Compensation</div>
          </div>
        ))}
      </div>

      {/* Detail diff table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-panel">
              <th className="py-3 px-4 text-left text-xs font-medium text-subtle uppercase tracking-wider">
                Component
              </th>
              <th className="py-3 px-4 text-right text-xs font-medium text-subtle uppercase tracking-wider">
                Offer A
              </th>
              <th className="py-3 px-4 text-right text-xs font-medium text-subtle uppercase tracking-wider">
                Offer B
              </th>
              <th className="py-3 px-4 text-right text-xs font-medium text-subtle uppercase tracking-wider">
                Difference
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "Base Salary", a: s1.base_salary, b: s2.base_salary, d: diff.base_salary },
              { label: "Bonus", a: s1.bonus, b: s2.bonus, d: diff.bonus },
              { label: "Stock (annual)", a: s1.stock, b: s2.stock, d: diff.stock },
              { label: "Total TC", a: s1.total_compensation, b: s2.total_compensation, d: diff.total_compensation, bold: true },
            ].map(({ label, a, b, d, bold }) => (
              <tr key={label} className="border-b border-border last:border-0 hover:bg-panel/30">
                <td className={clsx("py-3 px-4", bold ? "font-semibold text-text-primary" : "text-text-secondary")}>
                  {label}
                </td>
                <td className={clsx("py-3 px-4 text-right font-mono", bold ? "font-bold text-text-primary" : "text-text-secondary")}>
                  {formatINR(a)}
                </td>
                <td className={clsx("py-3 px-4 text-right font-mono", bold ? "font-bold text-text-primary" : "text-text-secondary")}>
                  {formatINR(b)}
                </td>
                <td className="py-3 px-4 text-right">
                  <DiffCell value={d} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-center">
        <Link href="/compare" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
          ← Start new comparison
        </Link>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-text-primary mb-1">
          Compare Offers
        </h1>
        <p className="text-text-secondary text-sm">
          Side-by-side breakdown of base, bonus, stock, and total compensation.
        </p>
      </div>
      <Suspense fallback={<div className="text-text-secondary text-sm">Loading...</div>}>
        <CompareContent />
      </Suspense>
    </div>
  );
}