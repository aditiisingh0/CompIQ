import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { normalizeCompany, displayCompany } from "../lib/normalize";
import { Level } from "@prisma/client";

const router = Router();

router.get("/:company", async (req: Request, res: Response) => {
  const companySlug = normalizeCompany(req.params.company);

  const salaries = await prisma.salary.findMany({
    where: { company: { contains: companySlug } },
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
    ...s,
    company: displayCompany(s.company),
    role: s.role
      .split(" ")
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    location: s.location
      .split(" ")
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
  }));

  return res.json({
    company: displayCompany(salaries[0].company),
    median_total_compensation,
    level_distribution,
    count: salaries.length,
    salaries: formatted,
  });
});

export default router;
