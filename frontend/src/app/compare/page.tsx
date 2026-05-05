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

// ── Level badge colors (AmbitionBox warm + levels.fyi precise) ─────────────
const LEVEL_PILL: Record<string, string> = {
  L3: "bg-emerald-50 border-emerald-200 text-emerald-700",
  L4: "bg-sky-50     border-sky-200     text-sky-700",
  L5: "bg-violet-50  border-violet-200  text-violet-700",
  L6: "bg-orange-50  border-orange-200  text-orange-700",
  L7: "bg-rose-50    border-rose-200    text-rose-700",
  L8: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700",
};

// ── Diff cell ──────────────────────────────────────────────────────────────
function DiffCell({ value }: { value: number }) {
  const isZero = value === 0;
  const isPos  = value > 0;
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 font-mono text-sm font-semibold px-2 py-0.5 rounded-lg",
        isZero
          ? "text-gray-400 bg-gray-50"
          : isPos
          ? "text-emerald-700 bg-emerald-50"
          : "text-rose-700 bg-rose-50"
      )}
    >
      {isZero ? (
        "—"
      ) : (
        <>
          <span>{isPos ? "▲" : "▼"}</span>
          {formatINR(Math.abs(value))}
          <span className="text-xs font-normal opacity-70">{isPos ? "more" : "less"}</span>
        </>
      )}
    </span>
  );
}

// ── Winner badge ───────────────────────────────────────────────────────────
function WinnerBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
      🏆 {label}
    </span>
  );
}

// ── Donut progress bar (visual TC comparison) ──────────────────────────────
function TcBar({ a, b }: { a: number; b: number }) {
  const total = a + b;
  const pctA  = total === 0 ? 50 : Math.round((a / total) * 100);
  const pctB  = 100 - pctA;
  return (
    <div className="w-full mt-2">
      <div className="flex rounded-full overflow-hidden h-2.5">
        <div
          className="bg-blue-500 transition-all duration-700"
          style={{ width: `${pctA}%` }}
        />
        <div
          className="bg-orange-400 transition-all duration-700"
          style={{ width: `${pctB}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-semibold mt-1 text-gray-400">
        <span className="text-blue-500">A · {pctA}%</span>
        <span className="text-orange-400">{pctB}% · B</span>
      </div>
    </div>
  );
}

// ── Selector UI (no IDs provided) ──────────────────────────────────────────
function SelectorUI({
  allSalaries,
  loadingList,
  listError,
  sel1,
  sel2,
  setSel1,
  setSel2,
  onCompare,
}: {
  allSalaries: Salary[];
  loadingList: boolean;
  listError: string | null;
  sel1: string;
  sel2: string;
  setSel1: (v: string) => void;
  setSel2: (v: string) => void;
  onCompare: () => void;
}) {
  const selectCls =
    "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all shadow-sm";

  return (
    <div className="max-w-lg mx-auto">
      {/* Header card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Top stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-violet-500 to-orange-400" />

        <div className="p-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg font-bold shadow-sm">
              ⇌
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">Compare Offers</h2>
              <p className="text-gray-500 text-xs">Pick two salaries to compare side-by-side</p>
            </div>
          </div>

          {/* Error */}
          {listError && (
            <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
              <span className="text-lg leading-none">⚠️</span>
              <div>
                <p className="font-semibold">{listError}</p>
                <code className="text-xs bg-red-100 px-1.5 py-0.5 rounded mt-1 inline-block">
                  cd backend && npm run dev
                </code>
              </div>
            </div>
          )}

          {/* Loading */}
          {loadingList && !listError && (
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-5">
              <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
              Loading salaries…
            </div>
          )}

          <div className="space-y-4">
            {/* Offer A */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">A</span>
                Offer A
                {allSalaries.length > 0 && (
                  <span className="text-blue-500 normal-case font-normal tracking-normal">
                    ({allSalaries.length} entries)
                  </span>
                )}
              </label>
              <select
                className={selectCls}
                value={sel1}
                onChange={(e) => setSel1(e.target.value)}
                disabled={loadingList || !!listError}
              >
                <option value="">
                  {loadingList ? "Loading…" : listError ? "Backend offline" : "Select a salary…"}
                </option>
                {allSalaries
                  .filter((s) => s.id !== sel2)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.company} · {s.role} · {s.level} · {formatINR(s.total_compensation)}
                    </option>
                  ))}
              </select>
            </div>

            {/* VS divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs font-bold text-gray-400 tracking-widest bg-gray-50 border border-gray-200 px-2.5 py-0.5 rounded-full">
                VS
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Offer B */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                <span className="w-5 h-5 rounded-full bg-orange-400 text-white text-[10px] font-bold flex items-center justify-center">B</span>
                Offer B
              </label>
              <select
                className={selectCls}
                value={sel2}
                onChange={(e) => setSel2(e.target.value)}
                disabled={loadingList || !!listError}
              >
                <option value="">
                  {loadingList ? "Loading…" : listError ? "Backend offline" : "Select a salary…"}
                </option>
                {allSalaries
                  .filter((s) => s.id !== sel1)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.company} · {s.role} · {s.level} · {formatINR(s.total_compensation)}
                    </option>
                  ))}
              </select>
            </div>

            <button
              onClick={onCompare}
              disabled={!sel1 || !sel2 || loadingList}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md active:scale-[0.99]"
            >
              Compare Offers →
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-400 text-xs mt-4">
        Or pick rows in the{" "}
        <Link href="/salaries" className="text-blue-600 hover:underline font-medium">
          salary table
        </Link>{" "}
        to compare directly.
      </p>
    </div>
  );
}

// ── Main compare content ───────────────────────────────────────────────────
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
    setLoadingList(true);
    fetchSalaries({ limit: 100 })
      .then((r) => { setAllSalaries(r.data); setListError(null); })
      .catch((e) => { setListError("Data is Not Coming From Backend."); console.error(e); })
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

  // ── No IDs: show selector ──────────────────────────────────────────────
  if (!id1 || !id2) {
    return (
      <SelectorUI
        allSalaries={allSalaries}
        loadingList={loadingList}
        listError={listError}
        sel1={sel1}
        sel2={sel2}
        setSel1={setSel1}
        setSel2={setSel2}
        onCompare={runCompare}
      />
    );
  }

  // ── Loading comparison ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="text-center py-24 text-gray-400">
        <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-medium">Loading comparison…</p>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────
  if (error || !result) {
    return (
      <div className="text-center py-24 text-gray-500">
        <div className="text-4xl mb-3">😕</div>
        <p className="font-semibold text-gray-800 mb-1">Comparison failed</p>
        <p className="text-sm text-gray-400 mb-4">{error ?? "Could not load salary data."}</p>
        <Link
          href="/compare"
          className="inline-block px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          ← Try again
        </Link>
      </div>
    );
  }

  const { salary1: s1, salary2: s2, diff } = result;
  const levelDiff = diff.level_difference;
  const winner    = diff.total_compensation > 0 ? "A" : diff.total_compensation < 0 ? "B" : null;

  // ── Full comparison result ─────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto">

      {/* ── Level mismatch warning ── */}
      {levelDiff !== 0 && (
        <div className="mb-5 flex items-start gap-3 px-4 py-3.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-sm">
          <span className="text-lg leading-none mt-0.5">⚠️</span>
          <div>
            <span className="font-semibold">Level mismatch: </span>
            Comparing <span className="font-mono font-bold">{s1.level}</span> with{" "}
            <span className="font-mono font-bold">{s2.level}</span> — not a direct apples-to-apples comparison.
          </div>
        </div>
      )}

      {/* ── TC visual bar ── */}
      <div className="mb-6 px-5 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
          Total Compensation Split
        </p>
        <div className="flex justify-between text-sm font-bold text-gray-700 mb-1">
          <span className="text-blue-600">{s1.company} (A) — {formatINR(s1.total_compensation)}</span>
          <span className="text-orange-500">{formatINR(s2.total_compensation)} — {s2.company} (B)</span>
        </div>
        <TcBar a={s1.total_compensation} b={s2.total_compensation} />
      </div>

      {/* ── Offer cards ── */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {[
          { s: s1, label: "A", color: "border-blue-200 bg-blue-50/40", accent: "text-blue-600", badge: "bg-blue-600" },
          { s: s2, label: "B", color: "border-orange-200 bg-orange-50/40", accent: "text-orange-500", badge: "bg-orange-400" },
        ].map(({ s, label, color, accent, badge }) => (
          <div key={s.id} className={clsx("rounded-2xl border p-5 relative overflow-hidden", color)}>
            {/* Offer label */}
            <div className="flex items-center justify-between mb-4">
              <span className={clsx("w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-sm", badge)}>
                {label}
              </span>
              <span
                className={clsx(
                  "inline-flex items-center px-2 py-0.5 rounded-lg border text-xs font-mono font-bold",
                  LEVEL_PILL[s.level] ?? LEVEL_COLORS[s.level as Level]
                )}
              >
                {s.level}
              </span>
            </div>

            {/* Company name */}
            <Link
              href={`/company/${encodeURIComponent(s.company.toLowerCase())}`}
              className={clsx("font-bold text-2xl hover:underline underline-offset-2 block mb-1 text-gray-900", accent)}
            >
              {s.company}
            </Link>
            <p className="text-gray-600 text-sm font-medium">{s.role}</p>
            <p className="text-gray-400 text-xs mt-0.5">
              📍 {s.location} &nbsp;·&nbsp; 🧑‍💻 {s.experience_years}y exp
            </p>

            {/* TC big number */}
            <div className="mt-5 pt-4 border-t border-white/60">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Total TC</p>
              <p className={clsx("font-mono text-3xl font-extrabold", accent)}>
                {formatINR(s.total_compensation)}
              </p>
            </div>

            {/* Breakdown pills */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs bg-white/70 border border-gray-200 rounded-lg px-2 py-1 font-mono text-gray-600">
                Base {formatINR(s.base_salary)}
              </span>
              {s.bonus > 0 && (
                <span className="text-xs bg-white/70 border border-blue-100 rounded-lg px-2 py-1 font-mono text-blue-600">
                  Bonus {formatINR(s.bonus)}
                </span>
              )}
              {s.stock > 0 && (
                <span className="text-xs bg-white/70 border border-amber-100 rounded-lg px-2 py-1 font-mono text-amber-600">
                  Stock {formatINR(s.stock)}/yr
                </span>
              )}
            </div>

            {/* Winner tag */}
            {winner === label && (
              <div className="mt-3">
                <WinnerBadge label="Higher TC" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Detail diff table ── */}
      <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm mb-6">
        {/* Table header stripe */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-violet-400 to-orange-400" />
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="py-3 px-5 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
                Component
              </th>
              <th className="py-3 px-5 text-right text-xs font-bold text-blue-500 uppercase tracking-widest">
                Offer A
              </th>
              <th className="py-3 px-5 text-right text-xs font-bold text-orange-400 uppercase tracking-widest">
                Offer B
              </th>
              <th className="py-3 px-5 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">
                Difference
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "Base Salary",   a: s1.base_salary,        b: s2.base_salary,        d: diff.base_salary,        bold: false, icon: "💰" },
              { label: "Annual Bonus",  a: s1.bonus,              b: s2.bonus,              d: diff.bonus,              bold: false, icon: "🎯" },
              { label: "Stock / yr",    a: s1.stock,              b: s2.stock,              d: diff.stock,              bold: false, icon: "📈" },
              { label: "Total TC",      a: s1.total_compensation, b: s2.total_compensation, d: diff.total_compensation, bold: true,  icon: "🏆" },
            ].map(({ label, a, b, d, bold, icon }) => (
              <tr
                key={label}
                className={clsx(
                  "border-b border-gray-100 last:border-0 transition-colors",
                  bold ? "bg-gray-50/80 hover:bg-gray-100/60" : "hover:bg-gray-50/40"
                )}
              >
                <td className={clsx("py-3.5 px-5 flex items-center gap-2", bold ? "font-bold text-gray-800" : "text-gray-500")}>
                  <span className="text-base leading-none">{icon}</span>
                  {label}
                </td>
                <td className={clsx("py-3.5 px-5 text-right font-mono", bold ? "font-extrabold text-blue-600 text-base" : "text-gray-600")}>
                  {a > 0 ? formatINR(a) : <span className="opacity-30">—</span>}
                </td>
                <td className={clsx("py-3.5 px-5 text-right font-mono", bold ? "font-extrabold text-orange-500 text-base" : "text-gray-600")}>
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

      {/* ── Footer ── */}
      <div className="text-center">
        <Link
          href="/compare"
          className="inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-sm transition-colors font-medium"
        >
          ← Start new comparison
        </Link>
      </div>
    </div>
  );
}

// ── Page export ────────────────────────────────────────────────────────────
export default function ComparePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            ⇌
          </div>
          <h1 className="font-bold text-2xl text-gray-900 tracking-tight">
            Compare Offers
          </h1>
        </div>
        <p className="text-gray-500 text-sm ml-11">
          Side-by-side breakdown of base, bonus, stock &amp; total compensation
        </p>
      </div>

      <Suspense fallback={
        <div className="flex items-center gap-2 text-gray-400 text-sm py-10">
          <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          Loading…
        </div>
      }>
        <CompareContent />
      </Suspense>
    </div>
  );
}