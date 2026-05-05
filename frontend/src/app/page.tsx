import Link from "next/link";
import { fetchSalaries, formatINR, Level } from "@/lib/api";

const LEVEL_PILL: Record<string, string> = {
  L3: "bg-emerald-50 border-emerald-200 text-emerald-700",
  L4: "bg-sky-50     border-sky-200     text-sky-700",
  L5: "bg-violet-50  border-violet-200  text-violet-700",
  L6: "bg-orange-50  border-orange-200  text-orange-700",
  L7: "bg-rose-50    border-rose-200    text-rose-700",
  L8: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700",
};

const COMPANY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Google:    { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-100"    },
  Microsoft: { bg: "bg-sky-50",     text: "text-sky-700",     border: "border-sky-100"     },
  Amazon:    { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-100"   },
  Meta:      { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-100"  },
  Flipkart:  { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-100"  },
  Swiggy:    { bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-100"    },
  Razorpay:  { bg: "bg-teal-50",    text: "text-teal-700",    border: "border-teal-100"    },
  Zepto:     { bg: "bg-purple-50",  text: "text-purple-700",  border: "border-purple-100"  },
};

const featuredCompanies = [
  { name: "Google",    records: 28 },
  { name: "Microsoft", records: 21 },
  { name: "Amazon",    records: 19 },
  { name: "Meta",      records: 15 },
  { name: "Flipkart",  records: 12 },
  { name: "Swiggy",    records: 9  },
  { name: "Razorpay",  records: 7  },
  { name: "Zepto",     records: 5  },
];

export default async function HomePage() {
  let stats = { total: 0 };
  let recentSalaries: any[] = [];

  try {
    const data = await fetchSalaries({ limit: 5, sort: "desc" });
    stats.total = data.pagination.total;
    recentSalaries = data.data;
  } catch {}

  return (
    <div className="min-h-screen bg-[#F7F8FA]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-6 pt-20 pb-16 text-center border-b border-gray-200 bg-white">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Gradient blobs */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-56 h-56 bg-violet-100 rounded-full blur-3xl opacity-25 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gray-200 bg-white shadow-sm text-gray-500 text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Level-structured compensation data · India &amp; Global
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 text-gray-900 tracking-tight">
            Know what{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              engineers
            </span>{" "}
            actually make
          </h1>

          <p className="text-gray-500 text-base md:text-lg max-w-lg mx-auto mb-8 leading-relaxed">
            Structured by level. Comparable by design. Real TC breakdowns —
            not vague ranges — for India's tech ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link
              href="/salaries"
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-sm hover:from-blue-700 hover:to-violet-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              Browse Salaries →
            </Link>
            <Link
              href="/submit"
              className="px-7 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all bg-white shadow-sm"
            >
              + Submit Your Salary
            </Link>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            {[
              { label: "Salary records",  value: stats.total > 0 ? `${stats.total.toLocaleString()}+` : "39+", color: "text-blue-600" },
              { label: "Level system",    value: "L3 → L8",  color: "text-violet-600" },
              { label: "TC breakdown",    value: "3-part",   color: "text-orange-500" },
            ].map(({ label, value, color }) => (
              <div key={label} className="p-4 rounded-2xl border border-gray-200 bg-white text-center shadow-sm">
                <div className={`text-xl font-extrabold font-mono ${color}`}>{value}</div>
                <div className="text-xs text-gray-400 mt-1 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Browse by Company ── */}
      <section className="px-6 py-10 border-b border-gray-200 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold text-gray-900">Browse by company</h2>
          <Link href="/salaries" className="text-blue-600 text-sm font-semibold hover:underline underline-offset-2">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {featuredCompanies.map((c) => {
            const col = COMPANY_COLORS[c.name] ?? { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-100" };
            return (
              <Link
                key={c.name}
                href={`/company/${c.name.toLowerCase()}`}
                className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-200 bg-white hover:border-blue-200 hover:shadow-md transition-all group shadow-sm"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0 border ${col.bg} ${col.text} ${col.border}`}>
                  {c.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {c.name}
                  </div>
                  <div className="text-xs text-gray-400 font-medium">{c.records} records</div>
                </div>
              </Link>
            );
          })}
          <Link
            href="/salaries"
            className="flex items-center justify-center p-3.5 rounded-2xl border border-dashed border-gray-300 text-gray-400 text-sm font-semibold hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all"
          >
            View all →
          </Link>
        </div>
      </section>

      {/* ── Recently Added ── */}
      {recentSalaries.length > 0 && (
        <section className="px-6 py-10 border-b border-gray-200 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-extrabold text-gray-900">Recently added</h2>
            <Link href="/salaries" className="text-blue-600 text-sm font-semibold hover:underline underline-offset-2">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="h-[3px] w-full bg-gradient-to-r from-blue-500 via-violet-400 to-orange-400 rounded-t-2xl" />
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  {["Company", "Role", "Level", "Location", "Base", "Total TC"].map((h) => (
                    <th key={h} className={`py-3 px-4 text-left text-[11px] font-bold uppercase tracking-widest whitespace-nowrap ${h === "Total TC" ? "text-blue-400" : "text-gray-400"}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentSalaries.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors group">
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/company/${s.company.toLowerCase()}`}
                        className="font-bold text-gray-900 hover:text-blue-600 transition-colors group-hover:underline underline-offset-2"
                      >
                        {s.company}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">{s.role}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-xs font-mono font-bold ${LEVEL_PILL[s.level as Level] ?? ""}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                        {s.level}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 text-sm">
                      <span className="flex items-center gap-1">
                        <span className="text-[11px]">📍</span>
                        {s.location}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-700">{formatINR(s.base_salary)}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg text-sm">
                        {formatINR(s.total_compensation)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── Why Levels Matter ── */}
      <section className="px-6 py-12 border-b border-gray-200 max-w-7xl mx-auto w-full">
        <h2 className="text-xl font-extrabold text-center mb-8 text-gray-900">
          Why{" "}
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            levels
          </span>{" "}
          change everything
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: "🏷️",
              gradient: "from-blue-500 to-sky-400",
              title: "Same title ≠ same pay",
              body: '"Senior Engineer" could be L5 at one company and L6 at another. Title-only data is meaningless.',
            },
            {
              icon: "💰",
              gradient: "from-violet-500 to-purple-400",
              title: "TC = Base + Bonus + Stock",
              body: "We capture the full picture. Stock vesting and bonuses can double your effective salary.",
            },
            {
              icon: "⚖️",
              gradient: "from-orange-500 to-amber-400",
              title: "Real comparability",
              body: "Compare L5 at Google vs L5 at Flipkart — apples to apples, not guesswork.",
            },
          ].map(({ icon, gradient, title, body }) => (
            <div
              key={title}
              className="p-5 rounded-2xl border border-gray-200 bg-white hover:border-blue-200 hover:shadow-md transition-all shadow-sm group"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-lg mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                {icon}
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-2">{title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-12 max-w-7xl mx-auto w-full">
        <div className="relative overflow-hidden text-center p-10 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 border border-blue-500 shadow-xl">
          {/* Background circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold mb-4">
              🇮🇳 Built for Indian tech
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-2">Know your worth</h2>
            <p className="text-blue-100 text-sm mb-7 max-w-sm mx-auto leading-relaxed">
              Submit your salary anonymously and help others make better career decisions.
            </p>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              + Submit your salary
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}