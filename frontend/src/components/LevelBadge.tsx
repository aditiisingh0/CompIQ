import clsx from "clsx";
import { Level } from "@/lib/api";

const LEVEL_STYLES: Record<string, { pill: string; dot: string; label: string }> = {
  L3: { pill: "bg-emerald-50 border-emerald-200 text-emerald-700", dot: "bg-emerald-400", label: "Junior"   },
  L4: { pill: "bg-sky-50     border-sky-200     text-sky-700",     dot: "bg-sky-400",     label: "Mid"      },
  L5: { pill: "bg-violet-50  border-violet-200  text-violet-700",  dot: "bg-violet-400",  label: "Senior"   },
  L6: { pill: "bg-orange-50  border-orange-200  text-orange-700",  dot: "bg-orange-400",  label: "Staff"    },
  L7: { pill: "bg-rose-50    border-rose-200    text-rose-700",    dot: "bg-rose-400",    label: "Prin."    },
  L8: { pill: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700", dot: "bg-fuchsia-400", label: "Fellow"   },
};

interface Props {
  level: Level;
  showLabel?: boolean; // optionally show "Senior" etc next to level
}

export default function LevelBadge({ level, showLabel = false }: Props) {
  const style = LEVEL_STYLES[level];

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-xs font-mono font-bold transition-all hover:scale-105",
        style?.pill ?? "bg-gray-50 border-gray-200 text-gray-600"
      )}
    >
      {/* Colored dot */}
      <span
        className={clsx(
          "w-1.5 h-1.5 rounded-full flex-shrink-0",
          style?.dot ?? "bg-gray-400"
        )}
      />
      {level}
      {showLabel && style?.label && (
        <span className="font-sans font-medium opacity-60 text-[10px] ml-0.5">
          {style.label}
        </span>
      )}
    </span>
  );
}