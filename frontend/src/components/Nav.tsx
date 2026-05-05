"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/salaries", label: "Salaries", icon: "📊" },
  { href: "/compare",  label: "Compare",  icon: "⇌"  },
];

export default function Nav() {
  const path = usePathname();

  return (
    <header className="fixed top-[3px] left-0 right-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-[61px] flex items-center justify-between">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5" height="5" rx="1" fill="white" />
              <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.7" />
              <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.7" />
              <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.35" />
            </svg>
          </div>
          <span
            className="font-extrabold text-lg tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            CompIQ
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-blue-200 text-blue-500 bg-blue-50 tracking-widest uppercase">
            Beta
          </span>
        </Link>

        {/* ── Nav links ── */}
        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon }) => {
            const active = path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold transition-all",
                  active
                    ? "bg-blue-50 text-blue-600 border border-blue-100"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-transparent"
                )}
              >
                <span className="text-xs">{icon}</span>
                {label}
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 ml-0.5" />
                )}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="w-px h-5 bg-gray-200 mx-2" />

          {/* Submit CTA */}
          <Link
            href="/submit"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:from-blue-600 hover:to-violet-700 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            <span>+</span>
            Submit Salary
          </Link>
        </nav>
      </div>
    </header>
  );
}