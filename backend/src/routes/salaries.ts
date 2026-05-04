import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { SalaryQuerySchema } from "../lib/schemas";
import { normalizeCompany, displayCompany } from "../lib/normalize";
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
      where.company = { contains: normalizeCompany(company) };
    }
    if (role) {
      where.role = { contains: role.trim().toLowerCase() };
    }
    if (level) {
      where.level = level;
    }
    if (location) {
      where.location = { contains: location.trim().toLowerCase() };
    }

    const [salaries, total] = await Promise.all([
      prisma.salary.findMany({
        where,
        orderBy: { total_compensation: sort === "asc" ? "asc" : "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.salary.count({ where }),
    ]);

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
      data: formatted,
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error("❌ Salaries route error:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

export default router;