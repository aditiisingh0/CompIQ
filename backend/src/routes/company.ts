import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { normalizeCompany, displayCompany } from "../lib/normalize";

const router = Router();

router.get("/:company", async (req: Request, res: Response) => {
  try {
    const companySlug = normalizeCompany(req.params.company);

    const salaries = await prisma.salary.findMany({
      where: {
        company: { contains: companySlug, mode: "insensitive" }, // ✅ fix
      },
      orderBy: { total_compensation: "desc" },
    });

    if (salaries.length === 0) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Median total compensation
    const sorted = [...salaries].sort(
      (a, b) => a.total_compensation - b.total_compensation
    );
    const mid = Math.floor(sorted.length / 2);
    const median_total_compensation =
      sorted.length % 2 === 0
        ? (sorted[mid - 1].total_compensation + sorted[mid].total_compensation) / 2
        : sorted[mid].total_compensation;

    // Level distribution
    const levelCounts: Record<string, number> = {};
    for (const s of salaries) {
      levelCounts[s.level] = (levelCounts[s.level] ?? 0) + 1;
    }

    const level_distribution = Object.entries(levelCounts)
      .map(([level, count]) => ({ level, count }))
      .sort((a, b) => a.level.localeCompare(b.level));

    const formatted = salaries.map((s) => ({
      id:                 s.id,
      company:            displayCompany(s.company),
      role:               toTitleCase(s.role),
      level:              s.level,
      location:           toTitleCase(s.location),
      experience_years:   s.experience_years,
      base_salary:        s.base_salary,
      bonus:              s.bonus,
      stock:              s.stock,
      total_compensation: s.total_compensation,
      confidence_score:   s.confidence_score,
      created_at:         s.created_at,
    }));

    return res.json({
      company:                   displayCompany(salaries[0].company),
      median_total_compensation,
      level_distribution,
      count:                     salaries.length,
      salaries:                  formatted,
    });

  } catch (error) {
    console.error("❌ Company route error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      error:  "Internal server error",
      detail: process.env.NODE_ENV !== "production" ? message : undefined,
    });
  }
});

function toTitleCase(str: string): string {
  return str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export default router;