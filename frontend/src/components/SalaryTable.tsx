"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Salary } from "@/lib/api";
import SalaryRow from "./SalaryRow";

const TABLE_HEADERS = [
  "Company", "Role", "Level", "Location", "Exp", "Base", "Bonus", "Stock", "Total TC",
];

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

  // ── Empty state ──────────────────────────────────────────────────────────
  if (salaries.length === 0) {
    return (
      <div className="text-center py-24 border border-gray-200 rounded-2xl bg-gray-50/60">
        <div className="text-4xl mb-3">🔍</div>
        <p className="font-bold text-gray-800">No results found</p>
        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div>
      {/* ── Compare action bar ── */}
      {selected.length > 0 && (
        <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl border border-blue-200 bg-blue-50 shadow-sm animate-pulse-once">
          {/* Left: status */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i < selected.length ? "bg-blue-500" : "bg-blue-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-blue-700 font-semibold">
              {selected.length === 1
                ? "Select 1 more to compare"
                : "Ready to compare! ✓"}
            </span>
          </div>

          {/* Right: actions */}
          <div className="ml-auto flex items-center gap-2">
            {selected.length === 2 && (
              <button
                onClick={goCompare}
                className="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                Compare →
              </button>
            )}
            <button
              onClick={() => setSelected([])}
              className="px-3 py-1.5 rounded-xl text-blue-500 hover:text-blue-700 hover:bg-blue-100 text-sm font-medium transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Top gradient stripe */}
        <div className="h-[3px] w-full bg-gradient-to-r from-blue-500 via-violet-400 to-orange-400 rounded-t-2xl" />

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80">
              {/* Checkbox col */}
              <th className="pl-4 py-3 w-10" />
              {TABLE_HEADERS.map((h) => (
                <th
                  key={h}
                  className={`py-3 pr-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap ${
                    h === "Total TC" ? "text-blue-400" : ""
                  }`}
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