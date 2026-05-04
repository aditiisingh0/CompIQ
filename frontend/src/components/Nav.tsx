"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/salaries", label: "Salaries" },
  { href: "/compare", label: "Compare" },
];

export default function Nav() {
  const path = usePathname();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-ink/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded bg-accent flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" fill="white" />
              <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.6" />
              <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.6" />
              <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.3" />
            </svg>
          </div>
          <span className="font-display font-700 text-lg tracking-tight text-text-primary group-hover:text-accent transition-colors">
            CompIQ
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-accent/30 text-accent">
            BETA
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                path.startsWith(href)
                  ? "bg-accent/15 text-accent"
                  : "text-text-secondary hover:text-text-primary hover:bg-panel"
              )}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/submit"
            className="ml-3 px-4 py-1.5 rounded-md text-sm font-medium bg-accent text-white hover:bg-accent/90 transition-colors"
          >
            Submit Salary
          </Link>
        </nav>
      </div>
    </header>
  );
}
