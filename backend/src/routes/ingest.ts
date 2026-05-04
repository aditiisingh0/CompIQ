import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { IngestSalarySchema } from "../lib/schemas";
import { normalizeCompany } from "../lib/normalize";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  // 1. Parse & validate
  const parsed = IngestSalarySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const data = parsed.data;

  // 2. Normalize company name
  const company = normalizeCompany(data.company);

  // 3. Compute total compensation
  const total_compensation = data.base_salary + data.bonus + data.stock;

  // 4. Deduplicate: reject if identical entry exists (same company+role+level+location+base)
  const existing = await prisma.salary.findFirst({
    where: {
      company,
      role: data.role.trim().toLowerCase(),
      level: data.level,
      location: data.location.trim().toLowerCase(),
      base_salary: data.base_salary,
    },
  });

  if (existing) {
    return res.status(409).json({
      error: "Duplicate entry",
      message: "An identical salary record already exists",
      existing_id: existing.id,
    });
  }

  // 5. Store
  const salary = await prisma.salary.create({
    data: {
      company,
      role: data.role.trim().toLowerCase(),
      level: data.level,
      location: data.location.trim().toLowerCase(),
      experience_years: data.experience_years,
      base_salary: data.base_salary,
      bonus: data.bonus,
      stock: data.stock,
      total_compensation,
      confidence_score: data.confidence,
    },
  });

  return res.status(201).json({
    success: true,
    id: salary.id,
    total_compensation,
  });
});

export default router;
