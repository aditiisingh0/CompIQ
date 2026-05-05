"use client";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";

interface Props {
  currentPage: number;
  totalPages: number;
  total: number;
}

export default function Pagination({ currentPage, totalPages, total }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const go = (page: number) => {
    const p = new URLSearchParams(params.toString());
    p.set("page", String(page));
    router.push(`/salaries?${p.toString()}`);
  };

  if (totalPages <= 1) return null;

  // Generate page numbers to show
  const getPages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">

      {/* ── Result count ── */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">
          <span className="font-bold text-gray-700">{total}</span> results
        </span>
        <div className="w-px h-3.5 bg-gray-200" />
        <span className="text-xs text-gray-400">
          Page <span className="font-bold text-gray-700">{currentPage}</span> of{" "}
          <span className="font-bold text-gray-700">{totalPages}</span>
        </span>

        {/* Progress bar */}
        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden ml-1">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-300"
            style={{ width: `${(currentPage / totalPages) * 100}%` }}
          />
        </div>
      </div>

      {/* ── Page buttons ── */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => go(currentPage - 1)}
          disabled={currentPage === 1}
          className={clsx(
            "flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all",
            currentPage === 1
              ? "border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50"
              : "border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 bg-white shadow-sm"
          )}
        >
          ← Prev
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-1">
          {getPages().map((p, i) =>
            p === "..." ? (
              <span key={`dots-${i}`} className="px-1.5 text-gray-300 text-xs select-none">
                ···
              </span>
            ) : (
              <button
                key={p}
                onClick={() => go(p as number)}
                className={clsx(
                  "w-8 h-8 rounded-xl text-xs font-bold transition-all",
                  p === currentPage
                    ? "bg-blue-600 text-white shadow-sm scale-105"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-800 bg-white border border-gray-200 shadow-sm"
                )}
              >
                {p}
              </button>
            )
          )}
        </div>

        {/* Next */}
        <button
          onClick={() => go(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={clsx(
            "flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all",
            currentPage === totalPages
              ? "border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50"
              : "border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 bg-white shadow-sm"
          )}
        >
          Next →
        </button>
      </div>
    </div>
  );
}