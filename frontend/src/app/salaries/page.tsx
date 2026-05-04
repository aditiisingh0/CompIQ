import { Suspense } from "react";
import { fetchSalaries, SalaryFilters as SalaryFiltersType, Level } from "@/lib/api";
import SalaryFilters from "@/components/SalaryFilters";
import SalaryTable from "@/components/SalaryTable";
import Pagination from "@/components/Pagination";

interface PageProps {
  searchParams: {
    company?: string;
    role?: string;
    level?: string;
    location?: string;
    sort?: string;
    page?: string;
  };
}

export default async function SalariesPage({ searchParams }: PageProps) {
  const filters: SalaryFiltersType = {
    company: searchParams.company,
    role: searchParams.role,
    level: searchParams.level as Level | undefined,
    location: searchParams.location,
    sort: (searchParams.sort as "asc" | "desc") || "desc",
    page: parseInt(searchParams.page || "1"),
    limit: 20,
  };

  let result;
  let error = false;
  try {
    result = await fetchSalaries(filters);
  } catch {
    error = true;
  }

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

      {/* Table */}
      {error ? (
        <div className="text-center py-24 text-text-secondary">
          <p className="text-4xl mb-3">⚠️</p>
          <p>Could not connect to the API. Make sure the backend is running.</p>
          <code className="text-xs text-accent mt-2 block">
            http://localhost:4000
          </code>
        </div>
      ) : result ? (
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
      ) : null}
    </div>
  );
}
