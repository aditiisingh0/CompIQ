import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { CompareSchema } from "../lib/schemas";
import { displayCompany } from "../lib/normalize";

const router = Router();

const LEVEL_ORDER: Record<string, number> = {
  L3: 3,
  L4: 4,
  L5: 5,
  L6: 6,
  L7: 7,
  L8: 8,
};

router.get("/", async (req: Request, res: Response) => {
  const parsed = CompareSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid query params",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const { salaryId1, salaryId2 } = parsed.data;

  if (salaryId1 === salaryId2) {
    return res.status(400).json({ error: "Cannot compare a salary with itself" });
  }

  const [s1, s2] = await Promise.all([
    prisma.salary.findUnique({ where: { id: salaryId1 } }),
    prisma.salary.findUnique({ where: { id: salaryId2 } }),
  ]);

  if (!s1) return res.status(404).json({ error: `Salary ${salaryId1} not found` });
  if (!s2) return res.status(404).json({ error: `Salary ${salaryId2} not found` });

  const levelDiff = LEVEL_ORDER[s2.level] - LEVEL_ORDER[s1.level];

  const format = (s: typeof s1) => ({
    id: s.id,
    company: displayCompany(s.company),
    role: s.role
      .split(" ")
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    level: s.level,
    location: s.location,
    experience_years: s.experience_years,
    base_salary: s.base_salary,
    bonus: s.bonus,
    stock: s.stock,
    total_compensation: s.total_compensation,
  });

  return res.json({
    salary1: format(s1),
    salary2: format(s2),
    diff: {
      base_salary: s2.base_salary - s1.base_salary,
      bonus: s2.bonus - s1.bonus,
      stock: s2.stock - s1.stock,
      total_compensation: s2.total_compensation - s1.total_compensation,
      level_difference: levelDiff, // positive = s2 is higher level
    },
  });
});

export default router;
