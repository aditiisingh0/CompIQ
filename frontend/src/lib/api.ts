const API = "https://compiq.onrender.com";

export type Level = "L3" | "L4" | "L5" | "L6" | "L7" | "L8";

export interface Salary {
  id: string;
  company: string;
  role: string;
  level: Level;
  location: string;
  experience_years: number;
  base_salary: number;
  bonus: number;
  stock: number;
  total_compensation: number;
  confidence_score: number;
  created_at: string;
}

export interface SalaryListResponse {
  data: Salary[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface CompanyResponse {
  company: string;
  median_total_compensation: number;
  level_distribution: { level: string; count: number }[];
  count: number;
  salaries: Salary[];
}

export interface CompareResponse {
  salary1: Salary;
  salary2: Salary;
  diff: {
    base_salary: number;
    bonus: number;
    stock: number;
    total_compensation: number;
    level_difference: number;
  };
}

export interface SalaryFilters {
  company?: string;
  role?: string;
  level?: Level | "";
  location?: string;
  sort?: "asc" | "desc";
  page?: number;
  limit?: number;
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") q.set(k, String(v));
  }
  return q.toString() ? `?${q.toString()}` : "";
}

export async function fetchSalaries(
  filters: SalaryFilters = {}
): Promise<SalaryListResponse> {
  const qs = buildQuery(filters as Record<string, string | number | undefined>);
  const res = await fetch(`${API}/salaries${qs}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch salaries");
  return res.json();
}

export async function fetchCompany(slug: string): Promise<CompanyResponse> {
  const res = await fetch(`${API}/company/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Company not found");
  return res.json();
}

export async function fetchCompare(
  id1: string,
  id2: string
): Promise<CompareResponse> {
  const res = await fetch(`${API}/compare?salaryId1=${id1}&salaryId2=${id2}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Compare failed");
  return res.json();
}

export function formatINR(n: number): string {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export function formatDiff(n: number): string {
  const sign = n >= 0 ? "+" : "";
  return `${sign}${formatINR(Math.abs(n))}${n < 0 ? " less" : " more"}`;
}

export const LEVEL_COLORS: Record<Level, string> = {
  L3: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  L4: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  L5: "bg-accent/10 text-accent border-accent/20",
  L6: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  L7: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  L8: "bg-red-500/10 text-red-400 border-red-500/20",
};

export const LEVELS: Level[] = ["L3", "L4", "L5", "L6", "L7", "L8"];
