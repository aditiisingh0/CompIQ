"use client";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import {
  fetchSalaries,
  SalaryFilters as SalaryFiltersType,
  SalaryListResponse,
  Level,
  formatINR,
  LEVEL_COLORS,
} from "@/lib/api";
import Pagination from "@/components/Pagination";

// ── Constants ──────────────────────────────────────────────────────────────
const LEVELS: Level[] = ["L3", "L4", "L5", "L6", "L7", "L8"];
const CITIES = ["Bangalore", "Hyderabad", "Pune", "Mumbai", "Noida / Gurgaon", "Chennai", "Remote"];

const LEVEL_PILL: Record<Level, string> = {
  L3: "bg-teal-50   border-teal-200   text-teal-800",
  L4: "bg-blue-50   border-blue-200   text-blue-800",
  L5: "bg-amber-50  border-amber-200  text-amber-800",
  L6: "bg-purple-50 border-purple-200 text-purple-800",
  L7: "bg-red-50    border-red-200    text-red-800",
  L8: "bg-pink-50   border-pink-200   text-pink-800",
};

const TABLE_HEADERS = [
  { key: "company",  label: "Company",  sortable: true  },
  { key: "role",     label: "Role",     sortable: false },
  { key: "level",    label: "Level",    sortable: false },
  { key: "location", label: "Location", sortable: true  },
  { key: "exp",      label: "Exp",      sortable: true  },
  { key: "base",     label: "Base",     sortable: true  },
  { key: "bonus",    label: "Bonus",    sortable: false },
  { key: "stock",    label: "Stock",    sortable: false },
  { key: "tc",       label: "Total TC", sortable: true  },
];

// ── Skeleton rows ──────────────────────────────────────────────────────────
function SkeletonRows({ count = 10 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="border-b border-border last:border-0">
          {Array.from({ length: 9 }).map((_, j) => (
            <td key={j} className="py-3 px-4">
              <div
                className="h-3 rounded bg-panel animate-pulse"
                style={{ width: `${55 + ((i * 3 + j * 7) % 35)}%`, animationDelay: `${i * 60}ms` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ── Active filter chip ─────────────────────────────────────────────────────
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-xs font-medium text-teal-800">
      {label}
      <button
        onClick={onRemove}
        className="text-teal-600 hover:text-teal-900 leading-none text-sm"
        aria-label="Remove filter"
      >
        ×
      </button>
    </span>
  );
}

// ── Error state ────────────────────────────────────────────────────────────
function ErrorState({ retryCount, onRetry }: { retryCount: number; onRetry: () => void }) {
  return (
    <div className="text-center py-16 border border-border rounded-xl bg-panel">
      <div className="w-11 h-11 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-700 font-medium mx-auto mb-4">
        !
      </div>
      <p className="font-medium text-text-primary text-sm mb-1">Could not connect to the API</p>
      <p className="text-text-secondary text-xs mb-3 max-w-xs mx-auto">
        The backend may be waking up on Render's free tier. Please wait a moment and retry.
      </p>
      <code className="text-xs text-accent bg-teal-50 border border-teal-200 px-3 py-1 rounded-md block w-fit mx-auto mb-5">
        https://compiq.onrender.com
      </code>
      {retryCount > 0 && (
        <p className="text-xs text-text-secondary mb-3">
          Attempted {retryCount}/3 retries automatically
        </p>
      )}
      <button
        onClick={onRetry}
        className="px-5 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
      >
        Retry now
      </button>
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="text-center py-16 border border-border rounded-xl bg-panel">
      <div className="w-10 h-10 rounded-full bg-panel border border-border flex items-center justify-center text-text-secondary mx-auto mb-4 text-lg opacity-40">
        ∅
      </div>
      <p className="font-medium text-text-primary text-sm mb-1">No salaries match your filters</p>
      <p className="text-text-secondary text-xs mb-5">Try adjusting or clearing your search filters</p>
      <button
        onClick={onClear}
        className="px-5 py-2 rounded-xl border border-border text-text-secondary text-sm hover:border-accent/40 hover:text-accent transition-colors"
      >
        Clear all filters
      </button>
    </div>
  );
}

// ── Main salaries content ──────────────────────────────────────────────────
function SalariesContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [result,     setResult]     = useState<SalaryListResponse | null>(null);
  const [error,      setError]      = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [sortCol,    setSortCol]    = useState<string>("tc");
  const [sortDir,    setSortDir]    = useState<"asc" | "desc">("desc");

  const filters: SalaryFiltersType = {
    company:  searchParams.get("company")  || undefined,
    role:     searchParams.get("role")     || undefined,
    level:    (searchParams.get("level")   as Level) || undefined,
    location: searchParams.get("location") || undefined,
    sort:     (searchParams.get("sort")    as "asc" | "desc") || "desc",
    page:     parseInt(searchParams.get("page") || "1"),
    limit:    20,
  };

  const hasFilters = !!(filters.company || filters.role || filters.level || filters.location);

  // Update a single search param
  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push("/salaries");
  };

  // Column sort — pushes sort to URL so it's shareable
  const handleSort = (col: string) => {
    const newDir = sortCol === col && sortDir === "desc" ? "asc" : "desc";
    setSortCol(col);
    setSortDir(newDir);
    setParam("sort", newDir);
  };

  const load = useCallback(async (attempt = 0) => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchSalaries(filters);
      setResult(data);
    } catch {
      if (attempt < 3) {
        const delay = [3000, 6000, 10000][attempt];
        setRetryCount(attempt + 1);
        setTimeout(() => load(attempt + 1), delay);
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  }, [searchParams]); // eslint-disable-line

  useEffect(() => { load(0); }, [searchParams]); // eslint-disable-line

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* ── Page header ── */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-text-primary mb-1">
          Salary database
        </h1>
        <p className="text-text-secondary text-sm">
          Level-structured compensation data · Filter, sort, compare
        </p>
      </div>

      {/* ── Filter bar ── */}
      <div className="flex flex-wrap gap-2 mb-3 items-center">
        <input
          className="px-3 py-2 rounded-lg border border-border bg-panel text-sm text-text-primary placeholder:text-subtle focus:outline-none focus:border-accent/60 transition-colors min-w-32"
          placeholder="Company"
          defaultValue={filters.company ?? ""}
          onChange={(e) => setParam("company", e.target.value)}
        />
        <input
          className="px-3 py-2 rounded-lg border border-border bg-panel text-sm text-text-primary placeholder:text-subtle focus:outline-none focus:border-accent/60 transition-colors min-w-32"
          placeholder="Role"
          defaultValue={filters.role ?? ""}
          onChange={(e) => setParam("role", e.target.value)}
        />
        <select
          className="px-3 py-2 rounded-lg border border-border bg-panel text-sm text-text-secondary focus:outline-none focus:border-accent/60 transition-colors cursor-pointer"
          value={filters.level ?? ""}
          onChange={(e) => setParam("level", e.target.value)}
        >
          <option value="">All levels</option>
          {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <select
          className="px-3 py-2 rounded-lg border border-border bg-panel text-sm text-text-secondary focus:outline-none focus:border-accent/60 transition-colors cursor-pointer"
          value={filters.location ?? ""}
          onChange={(e) => setParam("location", e.target.value)}
        >
          <option value="">All cities</option>
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="w-px h-5 bg-border" />

        {hasFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-text-secondary hover:text-text-primary px-2 py-1.5 rounded-lg hover:bg-panel transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Active filter chips ── */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.company  && <FilterChip label={`Company: ${filters.company}`}  onRemove={() => setParam("company", "")} />}
          {filters.role     && <FilterChip label={`Role: ${filters.role}`}        onRemove={() => setParam("role", "")} />}
          {filters.level    && <FilterChip label={`Level: ${filters.level}`}      onRemove={() => setParam("level", "")} />}
          {filters.location && <FilterChip label={filters.location}               onRemove={() => setParam("location", "")} />}
        </div>
      )}

      {/* ── Result meta row ── */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-text-secondary">
          {loading
            ? retryCount > 0
              ? `Backend waking up… attempt ${retryCount}/3`
              : "Loading salaries…"
            : result
              ? <><span className="text-text-primary font-medium">{result.pagination.total}</span> records found</>
              : null
          }
        </p>
        <select
          className="text-xs px-2.5 py-1.5 rounded-lg border border-border bg-panel text-text-secondary focus:outline-none cursor-pointer"
          value={filters.sort}
          onChange={(e) => setParam("sort", e.target.value)}
        >
          <option value="desc">Highest TC first</option>
          <option value="asc">Lowest TC first</option>
        </select>
      </div>

      {/* ── Error ── */}
      {!loading && error && (
        <ErrorState retryCount={retryCount} onRetry={() => load(0)} />
      )}

      {/* ── Empty state ── */}
      {!loading && !error && result && result.data.length === 0 && (
        <EmptyState onClear={clearAllFilters} />
      )}

      {/* ── Table (loading skeleton or real data) ── */}
      {(!error) && (result?.data.length ?? 1) > 0 && (
        <>
          <div className="overflow-x-auto rounded-xl border border-border mb-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-panel">
                  {TABLE_HEADERS.map(({ key, label, sortable }) => (
                    <th
                      key={key}
                      onClick={() => sortable && handleSort(key)}
                      className={clsx(
                        "py-3 px-4 text-left text-xs font-medium text-subtle uppercase tracking-wider whitespace-nowrap",
                        sortable && "cursor-pointer hover:text-text-primary select-none",
                        sortCol === key && "text-accent"
                      )}
                    >
                      {label}
                      {sortable && (
                        <span className={clsx("ml-1 text-xs", sortCol === key ? "opacity-100 text-accent" : "opacity-25")}>
                          {sortCol === key ? (sortDir === "desc" ? "↓" : "↑") : "↕"}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? <SkeletonRows count={10} />
                  : result?.data.map((s) => (
                      <tr key={s.id} className="border-b border-border last:border-0 hover:bg-panel/60 transition-colors">
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
                          <span className={clsx(
                            "inline-flex items-center px-2 py-0.5 rounded border text-xs font-mono font-medium",
                            LEVEL_PILL[s.level] ?? LEVEL_COLORS[s.level]
                          )}>
                            {s.level}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-text-secondary capitalize">{s.location}</td>
                        <td className="py-3 px-4">
                          <span className="bg-surface border border-border rounded-md px-1.5 py-0.5 text-xs font-mono text-text-secondary">
                            {s.experience_years}y
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-text-primary">{formatINR(s.base_salary)}</td>
                        <td className="py-3 px-4 font-mono text-blue-600">
                          {s.bonus > 0 ? formatINR(s.bonus) : <span className="opacity-25">—</span>}
                        </td>
                        <td className="py-3 px-4 font-mono text-amber-600">
                          {s.stock > 0 ? formatINR(s.stock) : <span className="opacity-25">—</span>}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-accent">
                          {formatINR(s.total_compensation)}
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          {!loading && result && (
            <Suspense>
              <Pagination
                currentPage={result.pagination.page}
                totalPages={result.pagination.total_pages}
                total={result.pagination.total}
              />
            </Suspense>
          )}
        </>
      )}
    </div>
  );
}

// ── Page export ────────────────────────────────────────────────────────────
export default function SalariesPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-6">
          <div className="h-7 w-48 rounded-lg bg-panel animate-pulse mb-2" />
          <div className="h-4 w-72 rounded-lg bg-panel animate-pulse" />
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-panel">
                {TABLE_HEADERS.map(({ label }) => (
                  <th key={label} className="py-3 px-4 text-left text-xs font-medium text-subtle uppercase tracking-wider">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody><SkeletonRows count={10} /></tbody>
          </table>
        </div>
      </div>
    }>
      <SalariesContent />
    </Suspense>
  );
}