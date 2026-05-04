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

export default function SalaryRow({ salary, selected, onSelect, canSelect }: Props) {
  return (
    <tr
      className={clsx(
        "border-b border-border transition-colors group",
        selected ? "bg-accent/5" : "hover:bg-panel/50"
      )}
    >
      {/* Compare checkbox */}
      <td className="pl-4 py-3">
        <button
          onClick={() => onSelect(salary.id)}
          disabled={!canSelect && !selected}
          className={clsx(
            "w-4 h-4 rounded border transition-all",
            selected
              ? "bg-accent border-accent"
              : canSelect || selected
              ? "border-border hover:border-accent/50"
              : "border-border opacity-30 cursor-not-allowed"
          )}
          title={selected ? "Deselect" : "Select for comparison"}
        >
          {selected && (
            <svg viewBox="0 0 12 12" className="w-3 h-3 mx-auto" fill="none">
              <path
                d="M2 6l3 3 5-5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </td>

      {/* Company */}
      <td className="py-3 pr-4">
        <Link
          href={`/company/${encodeURIComponent(salary.company.toLowerCase())}`}
          className="font-medium text-text-primary hover:text-accent transition-colors"
        >
          {salary.company}
        </Link>
      </td>

      {/* Role */}
      <td className="py-3 pr-4 text-text-secondary text-sm">{salary.role}</td>

      {/* Level */}
      <td className="py-3 pr-4">
        <span
          className={clsx(
            "inline-flex items-center px-2 py-0.5 rounded border text-xs font-mono font-medium",
            LEVEL_COLORS[salary.level]
          )}
        >
          {salary.level}
        </span>
      </td>

      {/* Location */}
      <td className="py-3 pr-4 text-text-secondary text-sm">{salary.location}</td>

      {/* Exp */}
      <td className="py-3 pr-4 text-text-secondary text-sm font-mono">
        {salary.experience_years}y
      </td>

      {/* Base */}
      <td className="py-3 pr-4 text-text-primary font-mono text-sm">
        {formatINR(salary.base_salary)}
      </td>

      {/* Bonus */}
      <td className="py-3 pr-4 text-accent-green font-mono text-sm">
        {salary.bonus > 0 ? formatINR(salary.bonus) : <span className="text-muted">—</span>}
      </td>

      {/* Stock */}
      <td className="py-3 pr-4 text-accent-amber font-mono text-sm">
        {salary.stock > 0 ? formatINR(salary.stock) : <span className="text-muted">—</span>}
      </td>

      {/* TC — highlighted */}
      <td className="py-3 pr-4">
        <span className="font-mono font-bold text-text-primary">
          {formatINR(salary.total_compensation)}
        </span>
      </td>
    </tr>
  );
}
