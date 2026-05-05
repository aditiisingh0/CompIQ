"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { LEVELS, Level } from "@/lib/api";
import { useCallback } from "react";

const CITIES = ["Bangalore", "Hyderabad", "Pune", "Mumbai", "Noida / Gurgaon", "Chennai", "Remote"];

const LEVEL_COLORS: Record<string, string> = {
  L3: "text-emerald-700 bg-emerald-50",
  L4: "text-sky-700 bg-sky-50",
  L5: "text-violet-700 bg-violet-50",
  L6: "text-orange-700 bg-orange-50",
  L7: "text-rose-700 bg-rose-50",
  L8: "text-fuchsia-700 bg-fuchsia-50",
};

export default function SalaryFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const p = new URLSearchParams(params.toString());
      if (value) p.set(key, value);
      else p.delete(key);
      p.delete("page");
      router.push(`/salaries?${p.toString()}`);
    },
    [params, router]
  );

  const hasFilters =
    params.get("company") || params.get("role") || params.get("level") || params.get("location");

  const inputCls =
    "w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all shadow-sm";

  return (
    <div className="mb-6">
      {/* ── Filter row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">

        {/* Company */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
            🏢
          </span>
          <input
            className={`${inputCls} pl-8`}
            placeholder="Company"
            defaultValue={params.get("company") ?? ""}
            onChange={(e) => update("company", e.target.value)}
          />
        </div>

        {/* Role */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
            👨‍💻
          </span>
          <input
            className={`${inputCls} pl-8`}
            placeholder="Role / Title"
            defaultValue={params.get("role") ?? ""}
            onChange={(e) => update("role", e.target.value)}
          />
        </div>

        {/* Level select */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
            🎯
          </span>
          <select
            className={`${inputCls} pl-8 cursor-pointer appearance-none`}
            value={params.get("level") ?? ""}
            onChange={(e) => update("level", e.target.value)}
          >
            <option value="">All Levels</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">▾</span>
        </div>

        {/* Location select */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
            📍
          </span>
          <select
            className={`${inputCls} pl-8 cursor-pointer appearance-none`}
            value={params.get("location") ?? ""}
            onChange={(e) => update("location", e.target.value)}
          >
            <option value="">All Cities</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">▾</span>
        </div>
      </div>

      {/* ── Level quick-filter pills ── */}
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest mr-1">
          Quick:
        </span>
        {LEVELS.map((l) => {
          const active = params.get("level") === l;
          return (
            <button
              key={l}
              onClick={() => update("level", active ? "" : l)}
              className={`px-2.5 py-0.5 rounded-lg border text-xs font-mono font-bold transition-all hover:scale-105 active:scale-95 ${
                active
                  ? `${LEVEL_COLORS[l]} border-current shadow-sm`
                  : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {l}
            </button>
          );
        })}

        {/* Clear filters */}
        {hasFilters && (
          <>
            <div className="w-px h-4 bg-gray-200 mx-1" />
            <button
              onClick={() => router.push("/salaries")}
              className="text-xs text-gray-400 hover:text-rose-500 font-medium transition-colors flex items-center gap-1"
            >
              <span>✕</span> Clear filters
            </button>
          </>
        )}
      </div>
    </div>
  );
}