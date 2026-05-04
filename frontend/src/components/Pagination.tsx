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

  return (
    <div className="mt-6 flex items-center justify-between text-sm">
      <span className="text-text-secondary">
        {total} results · Page {currentPage} of {totalPages}
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => go(currentPage - 1)}
          disabled={currentPage === 1}
          className={clsx(
            "px-3 py-1.5 rounded-md border text-sm transition-colors",
            currentPage === 1
              ? "border-border text-muted cursor-not-allowed"
              : "border-border text-text-secondary hover:border-accent/40 hover:text-text-primary"
          )}
        >
          ← Prev
        </button>
        <button
          onClick={() => go(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={clsx(
            "px-3 py-1.5 rounded-md border text-sm transition-colors",
            currentPage === totalPages
              ? "border-border text-muted cursor-not-allowed"
              : "border-border text-text-secondary hover:border-accent/40 hover:text-text-primary"
          )}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
