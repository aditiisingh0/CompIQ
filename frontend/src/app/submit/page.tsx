"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";

// ── Types ──────────────────────────────────────────────────────────────────
type Level = "L3" | "L4" | "L5" | "L6" | "L7" | "L8";
type Step = 1 | 2 | 3;

interface FormData {
  company: string;
  role: string;
  level: Level;
  location: string;
  experience_years: number;
  base_salary: number;
  bonus: number;
  stock: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function formatINR(n: number): string {
  if (!n || n === 0) return "—";
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

const LEVEL_STYLES: Record<Level, string> = {
  L3: "bg-teal-50   border-teal-200   text-teal-800",
  L4: "bg-blue-50   border-blue-200   text-blue-800",
  L5: "bg-amber-50  border-amber-200  text-amber-800",
  L6: "bg-purple-50 border-purple-200 text-purple-800",
  L7: "bg-red-50    border-red-200    text-red-800",
  L8: "bg-pink-50   border-pink-200   text-pink-800",
};

const LEVELS: Level[] = ["L3", "L4", "L5", "L6", "L7", "L8"];

const CITIES = [
  "Bangalore", "Hyderabad", "Pune", "Mumbai",
  "Noida / Gurgaon", "Chennai", "Remote", "Other",
];

const REVIEW_ROWS = (f: FormData) => [
  { label: "Company",       value: f.company || "—" },
  { label: "Role",          value: f.role || "—" },
  { label: "Level",         value: f.level },
  { label: "Location",      value: f.location || "—" },
  { label: "Experience",    value: f.experience_years ? `${f.experience_years} years` : "—" },
  { label: "Base salary",   value: formatINR(f.base_salary) },
  { label: "Bonus",         value: formatINR(f.bonus) },
  { label: "Stock / year",  value: formatINR(f.stock) },
  { label: "Total TC",      value: formatINR(f.base_salary + f.bonus + f.stock), highlight: true },
];

// ── Step indicator ─────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: Step }) {
  const steps = [
    { n: 1, label: "Company" },
    { n: 2, label: "Compensation" },
    { n: 3, label: "Review" },
  ] as const;

  return (
    <div className="flex items-center mb-8">
      {steps.map(({ n, label }, i) => {
        const done   = n < current;
        const active = n === current;
        return (
          <div key={n} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div
                className={clsx(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium border flex-shrink-0",
                  done   && "bg-teal-50 border-teal-200 text-teal-800",
                  active && "bg-accent border-accent text-white",
                  !done && !active && "bg-panel border-border text-text-secondary"
                )}
              >
                {done ? "✓" : n}
              </div>
              <span className={clsx("text-xs", active ? "text-accent font-medium" : "text-text-secondary")}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={clsx("flex-1 h-px mx-3", done ? "bg-teal-200" : "bg-border")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Field wrapper ──────────────────────────────────────────────────────────
function Field({
  label, hint, children,
}: {
  label: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-text-secondary">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full bg-panel border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-subtle focus:outline-none focus:border-accent/60 transition-colors";

// ── Main component ─────────────────────────────────────────────────────────
export default function SubmitPage() {
  const [step, setStep]       = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<FormData>({
    company: "", role: "", level: "L4", location: "",
    experience_years: 0, base_salary: 0, bonus: 0, stock: 0,
  });

  const set = (key: keyof FormData, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const totalTC = form.base_salary + form.bonus + form.stock;
  const showPreview = form.base_salary > 0;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetch("https://compiq.onrender.com/ingest-salary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Error submitting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="w-14 h-14 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-2xl mx-auto mb-5">
          ✓
        </div>
        <h2 className="font-display text-xl font-bold text-teal-900 mb-2">Salary submitted!</h2>
        <p className="text-text-secondary text-sm mb-8 max-w-sm mx-auto">
          Thank you for helping the community. Your data is now live and will help
          engineers make better career decisions.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => { setSubmitted(false); setStep(1); setForm({ company:"", role:"", level:"L4", location:"", experience_years:0, base_salary:0, bonus:0, stock:0 }); }}
            className="px-5 py-2.5 rounded-xl border border-border text-text-secondary text-sm hover:border-accent/40 hover:text-accent transition-colors"
          >
            Submit another
          </button>
          <Link
            href="/salaries"
            className="px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            Browse salaries →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">

      {/* Back link */}
      <Link href="/salaries" className="text-xs text-text-secondary hover:text-text-primary flex items-center gap-1 mb-5 transition-colors">
        ← Back to salaries
      </Link>

      <h1 className="font-display text-2xl font-bold text-text-primary mb-1">
        Submit your salary
      </h1>
      <p className="text-text-secondary text-sm mb-7">
        Anonymous · Takes 2 minutes · Helps the community
      </p>

      <StepIndicator current={step} />

      {/* ── Step 1: Company & Role ─────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-4">
          {/* Company + Role */}
          <div className="p-5 rounded-xl border border-border bg-panel space-y-4">
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">
              Company &amp; role
            </p>
            <Field label="Company name">
              <input
                className={inputCls}
                placeholder="e.g. Google, Flipkart, Razorpay"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
              />
            </Field>
            <Field label="Job title / role">
              <input
                className={inputCls}
                placeholder="e.g. Software Engineer, Data Scientist"
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
              />
            </Field>
          </div>

          {/* Level selector */}
          <div className="p-5 rounded-xl border border-border bg-panel">
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">
              Level
            </p>
            <div className="flex gap-2 flex-wrap">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => set("level", l)}
                  className={clsx(
                    "px-4 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors",
                    form.level === l
                      ? LEVEL_STYLES[l]
                      : "bg-panel border-border text-text-secondary hover:border-accent/40"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
            <p className="text-xs text-text-secondary mt-3">
              Not sure? Pick the level closest to your designation band.
            </p>
          </div>

          {/* Location + Experience */}
          <div className="p-5 rounded-xl border border-border bg-panel">
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-4">
              Location &amp; experience
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="City">
                <select
                  className={inputCls}
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                >
                  <option value="">Select city</option>
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Years of experience">
                <input
                  className={inputCls}
                  type="number"
                  min={0}
                  max={40}
                  placeholder="e.g. 4"
                  value={form.experience_years || ""}
                  onChange={(e) => set("experience_years", Number(e.target.value))}
                />
              </Field>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full py-3 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            Continue to compensation →
          </button>
        </div>
      )}

      {/* ── Step 2: Compensation ───────────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-border bg-panel space-y-4">
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">
              Compensation (annual, in ₹)
            </p>
            <Field label="Base salary" hint="Annual CTC, excluding bonus and stock">
              <input
                className={inputCls}
                type="number"
                placeholder="e.g. 2800000"
                value={form.base_salary || ""}
                onChange={(e) => set("base_salary", Number(e.target.value))}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Annual bonus">
                <input
                  className={inputCls}
                  type="number"
                  placeholder="e.g. 500000"
                  value={form.bonus || ""}
                  onChange={(e) => set("bonus", Number(e.target.value))}
                />
              </Field>
              <Field label="Stock / year (vested)">
                <input
                  className={inputCls}
                  type="number"
                  placeholder="e.g. 800000"
                  value={form.stock || ""}
                  onChange={(e) => set("stock", Number(e.target.value))}
                />
              </Field>
            </div>
          </div>

          {/* Live TC preview */}
          {showPreview && (
            <div className="p-5 rounded-xl bg-teal-50 border border-teal-200">
              <p className="text-xs font-medium text-teal-700 uppercase tracking-wider mb-2">
                Your total compensation
              </p>
              <p className="font-display text-3xl font-bold text-teal-900 mb-3">
                {formatINR(totalTC)}
              </p>
              <div className="flex gap-6 mb-3">
                {[
                  { label: "Base",  val: form.base_salary },
                  { label: "Bonus", val: form.bonus },
                  { label: "Stock", val: form.stock },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <div className="text-xs text-teal-600 uppercase tracking-wider">{label}</div>
                    <div className="text-sm font-medium text-teal-900 font-mono">{formatINR(val)}</div>
                  </div>
                ))}
              </div>
              {/* TC bar */}
              <div className="flex h-1.5 rounded-full overflow-hidden gap-px">
                <div className="bg-teal-500 rounded-full" style={{ flex: form.base_salary }} />
                <div className="bg-blue-400 rounded-full"  style={{ flex: form.bonus || 0.001 }} />
                <div className="bg-amber-400 rounded-full" style={{ flex: form.stock || 0.001 }} />
              </div>
            </div>
          )}

          {/* Anon note */}
          <div className="flex gap-3 p-4 rounded-xl bg-panel border border-border">
            <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-xs text-blue-700 flex-shrink-0 mt-0.5">
              i
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Your submission is completely anonymous. No personal information is collected
              or stored. Data is only shown as aggregated statistics.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-3 rounded-xl border border-border text-text-secondary text-sm hover:bg-panel transition-colors"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex-1 py-3 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              Review &amp; submit →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Review ────────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-border bg-panel">
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-4">
              Review your submission
            </p>
            <div className="divide-y divide-border">
              {REVIEW_ROWS(form).map(({ label, value, highlight }) => (
                <div key={label} className="flex items-center justify-between py-2.5">
                  <span className="text-xs text-text-secondary">{label}</span>
                  <span className={clsx(
                    "text-sm font-mono",
                    highlight ? "font-bold text-accent" : "text-text-primary"
                  )}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 p-4 rounded-xl bg-panel border border-border">
            <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-xs text-blue-700 flex-shrink-0 mt-0.5">
              i
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              By submitting, you confirm this data is accurate to the best of your knowledge.
              This helps engineers across India make better career decisions.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-3 rounded-xl border border-border text-text-secondary text-sm hover:bg-panel transition-colors"
            >
              ← Edit
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-60 transition-colors"
            >
              {loading ? "Submitting…" : "Submit salary →"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}