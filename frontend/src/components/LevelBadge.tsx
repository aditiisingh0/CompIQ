import clsx from "clsx";
import { Level, LEVEL_COLORS } from "@/lib/api";

export default function LevelBadge({ level }: { level: Level }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded border text-xs font-mono font-medium",
        LEVEL_COLORS[level]
      )}
    >
      {level}
    </span>
  );
}
