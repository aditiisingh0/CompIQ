"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Salary } from "@/lib/api";
import SalaryRow from "./SalaryRow";

export default function SalaryTable({ salaries }: { salaries: Salary[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(-2)
    );
  };

  const canSelect = selected.length < 2;

  const goCompare = () => {
    if (selected.length === 2) {
      router.push(`/compare?id1=${selected[0]}&id2=${selected[1]}`);
    }
  };

  if (salaries.length === 0) {
    return (
      <div className="text-center py-24 text-text-secondary">
        <div className="text-4xl mb-3">🔍</div>
        <p className="font-medium">No results found</p>
        <p className="text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div>
      {/* Compare action bar */}
      {selected.length > 0 && (
        <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-lg border border-accent/30 bg-accent/5 fade-up">
          <span className="text-sm text-accent font-medium">
            {selected.length === 1
              ? "Select 1 more to compare"
              : "2 selected — ready to compare"}
          </span>
          {selected.length === 2 && (
            <button
              onClick={goCompare}
              className="ml-auto px-4 py-1.5 rounded-md bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              Compare →
            </button>
          )}
          <button
            onClick={() => setSelected([])}
            className="text-text-secondary hover:text-text-primary text-sm transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-panel">
              <th className="pl-4 py-3 w-8" />
              {[
                "Company",
                "Role",
                "Level",
                "Location",
                "Exp",
                "Base",
                "Bonus",
                "Stock",
                "Total TC",
              ].map((h) => (
                <th
                  key={h}
                  className="py-3 pr-4 text-left text-xs font-medium text-subtle uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {salaries.map((s) => (
              <SalaryRow
                key={s.id}
                salary={s}
                selected={selected.includes(s.id)}
                onSelect={toggle}
                canSelect={canSelect}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
