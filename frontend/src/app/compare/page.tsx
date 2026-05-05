"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import {
  fetchCompare,
  fetchSalaries,
  CompareResponse,
  Salary,
  formatINR,
  LEVEL_COLORS,
  Level,
} from "@/lib/api";
import Link from "next/link";
import clsx from "clsx";

const LEVEL_PILL: Record<string, string> = {
  L3: "bg-emerald-950 border-emerald-700 text-emerald-400",
  L4: "bg-sky-950     border-sky-700     text-sky-400",
  L5: "bg-violet-950  border-violet-700  text-violet-400",
  L6: "bg-orange-950  border-orange-700  text-orange-400",
  L7: "bg-rose-950    border-rose-700    text-rose-400",
  L8: "bg-fuchsia-950 border-fuchsia-700 text-fuchsia-400",
};

function DiffCell({ value }: { value: number }) {
  const isZero = value === 0;
  const isPos  = value > 0;
  return (
    <span className={clsx(
      "inline-flex items-center gap-1 font-mono text-sm font-semibold px-2 py-0.5 rounded-lg",
      isZero ? "text-subtle bg-surface" :
      isPos  ? "text-accent-green bg-accent-green/10" :
               "text-accent-hot bg-accent-hot/10"
    )}>
      {isZero ? "—" : (
        <>
          <span>{isPos ? "▲" : "▼"}</span>
          {formatINR(Math.abs(value))}
          <span className="text-xs font-normal opacity-70">{isPos ? "more" : "less"}</span>
        </>
      )}
    </span>
  );
}

function WinnerBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-accent-amber bg-accent-amber/10 border border-accent-amber/30 px-2 py-0.5 rounded-full">
      🏆 Higher TC
    </span>
  );
}

function TcBar({ a, b }: { a: number; b: number }) {
  const total = a + b;
  const pctA  = total === 0 ? 50 : Math.round((a / total) * 100);
  return (
    <div className="w-full mt-2">
      <div className="flex rounded-full overflow-hidden h-2">
        <div className="bg-accent transition-all duration-700" style={{ width: `${pctA}%` }} />
        <div className="bg-accent-hot transition-all duration-700" style={{ width: `${100 - pctA}%` }} />
      </div>
      <div className="flex justify-between text-[10px] font-semibold mt-1 text-text-secondary">
        <span className="text-accent">A · {pctA}%</span>
        <span className="text-accent-hot">{100 - pctA}% · B</span>
      </div>
    </div>
  );
}

function SelectorUI({
  allSalaries, loadingList, listError,
  sel1, sel2, setSel1, setSel2, onCompare,
}: {
  allSalaries: Salary[]; loadingList: boolean; listError: string | null;
  sel1: string; sel2: string;
  setSel1: (v: string) => void; setSel2: (v: string) => void;
  onCompare: () => void;
}) {
  const selectCls =
    "w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent/60 transition-all";

  return (
    <div className="max-w-lg mx-auto">
      <div className="rounded-2xl border border-border bg-panel overflow-hidden">
        <div className="h-[2px] w-full bg-gradient-to-r from-accent via-accent-hot to-accent-green" />
        <div className="p-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-lg font-bold">
              ⇌
            </div>
            <div>
              <h2 className="font-display font-bold text-text-primary text-base">Compare Offers</h2>
              <p className="text-text-secondary text-xs">Pick two salaries to compare side-by-side</p>
            </div>
          </div>

          {listError && (
            <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl border border-accent-hot/30 bg-accent-hot/10 text-accent-hot text-sm">
              <span className="text-lg leading-none">⚠️</span>
              <p className="font-semibold">{listError}</p>
            </div>
          )}

          {loadingList && !listError && (
            <div className="flex items-center gap-2 text-text-secondary text-sm mb-5">
              <div className="w-4 h-4 border-2 border-border border-t-accent rounded-full animate-spin" />
              Loading salaries…
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary uppercase tracking-widest mb-1.5">
                <span className="w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">A</span>
                Offer A
                {allSalaries.length > 0 && (
                  <span className="text-accent normal-case font-normal tracking-normal">({allSalaries.length} entries)</span>
                )}
              </label>
              <select className={selectCls} value={sel1} onChange={(e) => setSel1(e.target.value)} disabled={loadingList || !!listError}>
                <option value="">{loadingList ? "Loading…" : listError ? "Backend offline" : "Select a salary…"}</option>
                {allSalaries.filter((s) => s.id !== sel2).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.company} · {s.role} · {s.level} · {formatINR(s.total_compensation)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs font-bold text-text-secondary tracking-widest bg-surface border border-border px-2.5 py-0.5 rounded-full">VS</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary uppercase tracking-widest mb-1.5">
                <span className="w-5 h-5 rounded-full bg-accent-hot text-white text-[10px] font-bold flex items-center justify-center">B</span>
                Offer B
              </label>
              <select className={selectCls} value={sel2} onChange={(e) => setSel2(e.target.value)} disabled={loadingList || !!listError}>
                <option value="">{loadingList ? "Loading…" : listError ? "Backend offline" : "Select a salary…"}</option>
                {allSalaries.filter((s) => s.id !== sel1).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.company} · {s.role} · {s.level} · {formatINR(s.total_compensation)}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onCompare}
              disabled={!sel1 || !sel2 || loadingList}
              className="w-full py-3 rounded-xl bg-accent text-white font-bold text-sm hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Compare Offers →
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-text-secondary text-xs mt-4">
        Or pick rows in the{" "}
        <Link href="/salaries" className="text-accent hover:underline font-medium">salary table</Link>{" "}
        to compare directly.
      </p>
    </div>
  );
}

function CompareContent() {
  const params = useSearchParams();
  const id1 = params.get("id1");
  const id2 = params.get("id2");

  const [result,      setResult]      = useState<CompareResponse | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [allSalaries, setAllSalaries] = useState<Salary[]>([]);
  const [sel1,        setSel1]        = useState("");
  const [sel2,        setSel2]        = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [listError,   setListError]   = useState<string | null>(null);

  useEffect(() => {
    fetchSalaries({ limit: 100 })
      .then((r) => { setAllSalaries(r.data); setListError(null); })
      .catch((e) => { setListError("Could not load salaries."); console.error(e); })
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

  if (!id1 || !id2) {
    return (
      <SelectorUI
        allSalaries={allSalaries} loadingList={loadingList} listError={listError}
        sel1={sel1} sel2={sel2} setSel1={setSel1} setSel2={setSel2} onCompare={runCompare}
      />
    );
  }

  if (loading) {
    return (
      <div className="text-center py-24 text-text-secondary">
        <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-medium">Loading comparison…</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="text-center py-24 text-text-secondary">
        <div className="text-4xl mb-3">😕</div>
        <p className="font-semibold text-text-primary mb-1">Comparison failed</p>
        <p className="text-sm text-text-secondary mb-4">{error ?? "Could not load salary data."}</p>
        <Link href="/compare" className="inline-block px-5 py-2 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors">
          ← Try again
        </Link>
      </div>
    );
  }

  const { salary1: s1, salary2: s2, diff } = result;
  const levelDiff = diff.level_difference;
  const winner    = diff.total_compensation > 0 ? "A" : diff.total_compensation < 0 ? "B" : null;

  return (
    <div className="max-w-4xl mx-auto">

      {/* Level mismatch warning */}
      {levelDiff !== 0 && (
        <div className="mb-5 flex items-start gap-3 px-4 py-3.5 rounded-xl border border-accent-amber/30 bg-accent-amber/10 text-accent-amber text-sm">
          <span className="text-lg leading-none mt-0.5">⚠️</span>
          <div>
            <span className="font-semibold">Level mismatch: </span>
            Comparing <span className="font-mono font-bold">{s1.level}</span> with{" "}
            <span className="font-mono font-bold">{s2.level}</span> — not apples-to-apples.
          </div>
        </div>
      )}

      {/* TC split bar */}
      <div className="mb-6 px-5 py-4 rounded-2xl border border-border bg-panel">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2">
          Total Compensation Split
        </p>
        <div className="flex justify-between text-sm font-bold mb-1">
          <span className="text-accent">{s1.company} (A) — {formatINR(s1.total_compensation)}</span>
          <span className="text-accent-hot">{formatINR(s2.total_compensation)} — {s2.company} (B)</span>
        </div>
        <TcBar a={s1.total_compensation} b={s2.total_compensation} />
      </div>

      {/* Offer cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {[
          { s: s1, label: "A", borderCls: "border-accent/30 bg-accent/5",     accentCls: "text-accent",     badgeCls: "bg-accent" },
          { s: s2, label: "B", borderCls: "border-accent-hot/30 bg-accent-hot/5", accentCls: "text-accent-hot", badgeCls: "bg-accent-hot" },
        ].map(({ s, label, borderCls, accentCls, badgeCls }) => (
          <div key={s.id} className={clsx("rounded-2xl border p-5", borderCls)}>
            <div className="flex items-center justify-between mb-4">
              <span className={clsx("w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center", badgeCls)}>
                {label}
              </span>
              <span className={clsx("inline-flex items-center px-2 py-0.5 rounded-lg border text-xs font-mono font-bold", LEVEL_PILL[s.level] ?? LEVEL_COLORS[s.level as Level])}>
                {s.level}
              </span>
            </div>

            <Link
              href={`/company/${encodeURIComponent(s.company.toLowerCase())}`}
              className={clsx("font-display font-bold text-2xl hover:underline underline-offset-2 block mb-1", accentCls)}
            >
              {s.company}
            </Link>
            <p className="text-text-secondary text-sm font-medium">{s.role}</p>
            <p className="text-text-secondary text-xs mt-0.5">
              📍 {s.location} &nbsp;·&nbsp; 🧑‍💻 {s.experience_years}y exp
            </p>

            <div className="mt-5 pt-4 border-t border-border">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-0.5">Total TC</p>
              <p className={clsx("font-mono text-3xl font-extrabold", accentCls)}>
                {formatINR(s.total_compensation)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs bg-surface border border-border rounded-lg px-2 py-1 font-mono text-text-secondary">
                Base {formatINR(s.base_salary)}
              </span>
              {s.bonus > 0 && (
                <span className="text-xs bg-surface border border-border rounded-lg px-2 py-1 font-mono text-accent-green">
                  Bonus {formatINR(s.bonus)}
                </span>
              )}
              {s.stock > 0 && (
                <span className="text-xs bg-surface border border-border rounded-lg px-2 py-1 font-mono text-accent-amber">
                  Stock {formatINR(s.stock)}/yr
                </span>
              )}
            </div>

            {winner === label && (
              <div className="mt-3"><WinnerBadge /></div>
            )}
          </div>
        ))}
      </div>

      {/* Diff table */}
      <div className="rounded-2xl border border-border overflow-hidden bg-panel mb-6">
        <div className="h-[2px] w-full bg-gradient-to-r from-accent via-accent-hot to-accent-green" />
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="py-3 px-5 text-left text-xs font-bold text-text-secondary uppercase tracking-widest">Component</th>
              <th className="py-3 px-5 text-right text-xs font-bold text-accent uppercase tracking-widest">Offer A</th>
              <th className="py-3 px-5 text-right text-xs font-bold text-accent-hot uppercase tracking-widest">Offer B</th>
              <th className="py-3 px-5 text-right text-xs font-bold text-text-secondary uppercase tracking-widest">Difference</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "Base Salary",  a: s1.base_salary,        b: s2.base_salary,        d: diff.base_salary,        bold: false, icon: "💰" },
              { label: "Annual Bonus", a: s1.bonus,              b: s2.bonus,              d: diff.bonus,              bold: false, icon: "🎯" },
              { label: "Stock / yr",   a: s1.stock,              b: s2.stock,              d: diff.stock,              bold: false, icon: "📈" },
              { label: "Total TC",     a: s1.total_compensation, b: s2.total_compensation, d: diff.total_compensation, bold: true,  icon: "🏆" },
            ].map(({ label, a, b, d, bold, icon }) => (
              <tr key={label} className={clsx("border-b border-border last:border-0 transition-colors", bold ? "bg-surface/60" : "hover:bg-surface/40")}>
                <td className={clsx("py-3.5 px-5 flex items-center gap-2", bold ? "font-bold text-text-primary" : "text-text-secondary")}>
                  <span className="text-base leading-none">{icon}</span>
                  {label}
                </td>
                <td className={clsx("py-3.5 px-5 text-right font-mono", bold ? "font-extrabold text-accent text-base" : "text-text-secondary")}>
                  {a > 0 ? formatINR(a) : <span className="opacity-30">—</span>}
                </td>
                <td className={clsx("py-3.5 px-5 text-right font-mono", bold ? "font-extrabold text-accent-hot text-base" : "text-text-secondary")}>
                  {b > 0 ? formatINR(b) : <span className="opacity-30">—</span>}
                </td>
                <td className="py-3.5 px-5 text-right">
                  <DiffCell value={d} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center">
        <Link href="/compare" className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm transition-colors font-medium">
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
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-sm">
            ⇌
          </div>
          <h1 className="font-display font-bold text-2xl text-text-primary tracking-tight">
            Compare Offers
          </h1>
        </div>
        <p className="text-text-secondary text-sm ml-11">
          Side-by-side breakdown of base, bonus, stock &amp; total compensation
        </p>
      </div>

      <Suspense fallback={
        <div className="flex items-center gap-2 text-text-secondary text-sm py-10">
          <div className="w-4 h-4 border-2 border-border border-t-accent rounded-full animate-spin" />
          Loading…
        </div>
      }>
        <CompareContent />
      </Suspense>
    </div>
  );
}