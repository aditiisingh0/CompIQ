import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { SalaryQuerySchema } from "../lib/schemas";
import { Prisma } from "@prisma/client";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const parsed = SalaryQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid query params",
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { company, role, level, location, sort, page, limit } = parsed.data;

    const where: Prisma.SalaryWhereInput = {};

    if (company) {
      where.company = { contains: company.trim(), mode: "insensitive" };
    }
    if (role) {
      where.role = { contains: role.trim(), mode: "insensitive" };
    }
    if (level) {
      // level is an enum in DB — must match exactly: L3, L4, L5 etc
      where.level = level as any;
    }
    if (location) {
      where.location = { contains: location.trim(), mode: "insensitive" };
    }

    const safePage  = Math.max(1, page  ?? 1);
    const safeLimit = Math.min(100, Math.max(1, limit ?? 20));

    const [salaries, total] = await Promise.all([
      prisma.salary.findMany({
        where,
        orderBy: { total_compensation: sort === "asc" ? "asc" : "desc" },
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
      }),
      prisma.salary.count({ where }),
    ]);

    const formatted = salaries.map((s) => ({
      id:                 s.id,
      company:            toTitleCase(s.company),   // display name from company field
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
      data: formatted,
      pagination: {
        total,
        page:        safePage,
        limit:       safeLimit,
        total_pages: Math.ceil(total / safeLimit),
      },
    });

  } catch (error) {
    console.error("❌ Salaries route error:", error);
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