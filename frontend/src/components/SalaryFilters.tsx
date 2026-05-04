"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { LEVELS, Level } from "@/lib/api";
import { useCallback } from "react";

export default function SalaryFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const p = new URLSearchParams(params.toString());
      if (value) {
        p.set(key, value);
      } else {
        p.delete(key);
      }
      p.delete("page"); // reset pagination on filter change
      router.push(`/salaries?${p.toString()}`);
    },
    [params, router]
  );

  const inputCls =
    "w-full bg-panel border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-subtle focus:outline-none focus:border-accent/60 transition-colors";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <input
        className={inputCls}
        placeholder="Company..."
        defaultValue={params.get("company") ?? ""}
        onChange={(e) => update("company", e.target.value)}
      />
      <input
        className={inputCls}
        placeholder="Role..."
        defaultValue={params.get("role") ?? ""}
        onChange={(e) => update("role", e.target.value)}
      />
      <select
        className={inputCls}
        defaultValue={params.get("level") ?? ""}
        onChange={(e) => update("level", e.target.value)}
      >
        <option value="">All Levels</option>
        {LEVELS.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
      <input
        className={inputCls}
        placeholder="Location..."
        defaultValue={params.get("location") ?? ""}
        onChange={(e) => update("location", e.target.value)}
      />
    </div>
  );
}
