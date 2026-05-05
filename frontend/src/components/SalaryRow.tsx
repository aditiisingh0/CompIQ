"use client";
import { Salary, formatINR, LEVEL_COLORS } from "@/lib/api";
import Link from "next/link";
import clsx from "clsx";

interface Props {
  salary: Salary;
  selected: boolean;
  onSelect: (id: string) => void;
  canSelect: boolean;
}

const LEVEL_PILL: Record<string, string> = {
  L3: "bg-emerald-50 border-emerald-200 text-emerald-700",
  L4: "bg-sky-50     border-sky-200     text-sky-700",
  L5: "bg-violet-50  border-violet-200  text-violet-700",
  L6: "bg-orange-50  border-orange-200  text-orange-700",
  L7: "bg-rose-50    border-rose-200    text-rose-700",
  L8: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700",
};

export default function SalaryRow({ salary, selected, onSelect, canSelect }: Props) {
  return (
    <tr
      className={clsx(
        "border-b border-gray-100 transition-all group",
        selected
          ? "bg-blue-50/60"
          : "hover:bg-gray-50/70"
      )}
    >
      {/* ── Compare checkbox ── */}
      <td className="pl-4 py-3.5">
        <button
          onClick={() => onSelect(salary.id)}
          disabled={!canSelect && !selected}
          title={selected ? "Deselect" : "Select for comparison"}
          className={clsx(
            "w-4 h-4 rounded-md border-2 transition-all flex items-center justify-center",
            selected
              ? "bg-blue-500 border-blue-500 shadow-sm"
              : canSelect || selected
              ? "border-gray-300 hover:border-blue-400 bg-white"
              : "border-gray-200 opacity-30 cursor-not-allowed bg-white"
          )}
        >
          {selected && (
            <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="none">
              <path
                d="M2 6l3 3 5-5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </td>

      {/* ── Company ── */}
      <td className="py-3.5 pr-4">
        <Link
          href={`/company/${encodeURIComponent(salary.company.toLowerCase())}`}
          className="font-bold text-gray-900 hover:text-blue-600 transition-colors text-sm group-hover:underline underline-offset-2"
        >
          {salary.company}
        </Link>
      </td>

      {/* ── Role ── */}
      <td className="py-3.5 pr-4 text-gray-500 text-sm max-w-[160px] truncate">
        {salary.role}
      </td>

      {/* ── Level ── */}
      <td className="py-3.5 pr-4">
        <span
          className={clsx(
            "inline-flex items-center px-2 py-0.5 rounded-lg border text-xs font-mono font-bold",
            LEVEL_PILL[salary.level] ?? LEVEL_COLORS[salary.level]
          )}
        >
          {salary.level}
        </span>
      </td>

      {/* ── Location ── */}
      <td className="py-3.5 pr-4 text-gray-500 text-sm">
        <span className="flex items-center gap-1">
          <span className="text-[11px]">📍</span>
          {salary.location}
        </span>
      </td>

      {/* ── Experience ── */}
      <td className="py-3.5 pr-4">
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-mono font-medium">
          {salary.experience_years}y
        </span>
      </td>

      {/* ── Base salary ── */}
      <td className="py-3.5 pr-4 font-mono text-sm text-gray-700">
        {formatINR(salary.base_salary)}
      </td>

      {/* ── Bonus ── */}
      <td className="py-3.5 pr-4 font-mono text-sm">
        {salary.bonus > 0 ? (
          <span className="text-emerald-600 font-semibold">{formatINR(salary.bonus)}</span>
        ) : (
          <span className="text-gray-300">—</span>
        )}
      </td>

      {/* ── Stock ── */}
      <td className="py-3.5 pr-4 font-mono text-sm">
        {salary.stock > 0 ? (
          <span className="text-amber-600 font-semibold">{formatINR(salary.stock)}</span>
        ) : (
          <span className="text-gray-300">—</span>
        )}
      </td>

      {/* ── Total TC ── */}
      <td className="py-3.5 pr-4">
        <span className="font-mono font-extrabold text-blue-600 text-sm bg-blue-50 px-2 py-0.5 rounded-lg">
          {formatINR(salary.total_compensation)}
        </span>
      </td>
    </tr>
  );
}