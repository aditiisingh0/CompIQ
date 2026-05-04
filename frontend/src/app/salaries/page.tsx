"use client";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  fetchSalaries,
  SalaryFilters as SalaryFiltersType,
  SalaryListResponse,
  Level,
} from "@/lib/api";
import SalaryFilters from "@/components/SalaryFilters";
import SalaryTable from "@/components/SalaryTable";
import Pagination from "@/components/Pagination";

function SalariesContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<SalaryListResponse | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const filters: SalaryFiltersType = {
    company: searchParams.get("company") || undefined,
    role: searchParams.get("role") || undefined,
    level: (searchParams.get("level") as Level) || undefined,
    location: searchParams.get("location") || undefined,
    sort: (searchParams.get("sort") as "asc" | "desc") || "desc",
    page: parseInt(searchParams.get("page") || "1"),
    limit: 20,
  };

  const load = useCallback(async (attempt = 0) => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchSalaries(filters);
      setResult(data);
      setError(false);
    } catch {
      if (attempt < 3) {
        // Retry after delay: 3s, 6s, 10s — gives Render time to wake up
        const delay = [3000, 6000, 10000][attempt];
        setRetryCount(attempt + 1);
        setTimeout(() => load(attempt + 1), delay);
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    load(0);
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-text-primary mb-1">
          Salary Database
        </h1>
        <p className="text-text-secondary text-sm">
          Level-structured compensation data. Filter, sort, compare.
        </p>
      </div>

      {/* Filters */}
      <Suspense>
        <SalaryFilters />
      </Suspense>

      {/* Loading */}
      {loading && (
        <div className="text-center py-24 text-text-secondary">
          <div className="w-8 h-8 border-2 border-accent/40 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          {retryCount > 0 ? (
            <p className="text-sm">
              Backend waking up... attempt {retryCount}/3
            </p>
          ) : (
            <p className="text-sm">Loading salaries...</p>
          )}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center py-24 text-text-secondary">
          <p className="text-4xl mb-3">⚠️</p>
          <p className="mb-3">Could not connect to the API.</p>
          <code className="text-xs text-accent mt-2 block mb-4">
            https://compiq.onrender.com
          </code>
          <button
            onClick={() => load(0)}
            className="px-4 py-2 bg-accent text-white rounded-lg text-sm hover:bg-accent/90 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      {!loading && !error && result && (
        <>
          <SalaryTable salaries={result.data} />
          <Suspense>
            <Pagination
              currentPage={result.pagination.page}
              totalPages={result.pagination.total_pages}
              total={result.pagination.total}
            />
          </Suspense>
        </>
      )}
    </div>
  );
}

export default function SalariesPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-24 text-text-secondary">
        <div className="w-8 h-8 border-2 border-accent/40 border-t-accent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm">Loading...</p>
      </div>
    }>
      <SalariesContent />
    </Suspense>
  );
}