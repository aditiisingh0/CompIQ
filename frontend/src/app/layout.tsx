import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import KeepAlive from "@/components/KeepAlive";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CompIQ — Compensation Intelligence",
  description:
    "Level-structured salary data for India and global tech. See what engineers actually make.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen bg-ink text-text-primary antialiased"
        style={{ fontFamily: "'Satoshi', sans-serif" }}
      >
        {/* ── Subtle top accent line ── */}
        <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--accent)] via-[var(--accent-hot)] to-[var(--accent-green)] z-50" />

        <Nav />
        <KeepAlive />

        {/* ── Page content ── */}
        <main className="pt-[64px] min-h-screen">{children}</main>

        {/* ── Footer ── */}
        <footer className="border-t border-border bg-surface mt-16">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

              {/* Brand */}
              <div className="md:col-span-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hot)] flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs font-bold">IQ</span>
                  </div>
                  <span className="font-extrabold text-text-primary tracking-tight" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                    CompIQ
                  </span>
                </div>
                <p className="text-text-secondary text-xs leading-relaxed max-w-[200px]">
                  Transparent, level-structured compensation data for Indian tech.
                </p>
              </div>

              {/* Explore */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-3">Explore</p>
                <ul className="space-y-2">
                  {[
                    { href: "/salaries", label: "Salary Database" },
                    { href: "/compare",  label: "Compare Offers"  },
                    { href: "/submit",   label: "Submit Salary"   },
                  ].map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-sm text-text-secondary hover:text-accent transition-colors"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Companies */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-3">Top Companies</p>
                <ul className="space-y-2">
                  {["Google", "Microsoft", "Amazon", "Flipkart", "Swiggy"].map((c) => (
                    <li key={c}>
                      <Link
                        href={`/company/${c.toLowerCase()}`}
                        className="text-sm text-text-secondary hover:text-accent transition-colors"
                      >
                        {c}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Levels */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-3">By Level</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { l: "L3", cls: "bg-emerald-950 text-emerald-400 border-emerald-800" },
                    { l: "L4", cls: "bg-sky-950 text-sky-400 border-sky-800" },
                    { l: "L5", cls: "bg-violet-950 text-violet-400 border-violet-800" },
                    { l: "L6", cls: "bg-orange-950 text-orange-400 border-orange-800" },
                    { l: "L7", cls: "bg-rose-950 text-rose-400 border-rose-800" },
                    { l: "L8", cls: "bg-fuchsia-950 text-fuchsia-400 border-fuchsia-800" },
                  ].map(({ l, cls }) => (
                    <Link
                      key={l}
                      href={`/salaries?level=${l}`}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-lg border text-xs font-mono font-bold hover:scale-105 transition-transform ${cls}`}
                    >
                      {l}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-text-secondary">
                © {new Date().getFullYear()} CompIQ · Built for Indian tech 🇮🇳
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                <span className="text-xs text-text-secondary">
                  Data contributed by the community
                </span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}