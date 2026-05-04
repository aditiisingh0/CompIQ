import { z } from "zod";

export const LevelEnum = z.enum(["L3", "L4", "L5", "L6", "L7", "L8"]);

export const IngestSalarySchema = z.object({
  company: z
    .string()
    .min(1, "Company is required")
    .max(100, "Company name too long"),
  role: z
    .string()
    .min(1, "Role is required")
    .max(150, "Role name too long"),
  level: LevelEnum,
  location: z
    .string()
    .min(1, "Location is required")
    .max(100, "Location too long"),
  experience_years: z
    .number()
    .int("Must be a whole number")
    .min(0, "Cannot be negative")
    .max(50, "Experience seems too high"),
  base_salary: z
    .number()
    .positive("Base salary must be positive")
    .max(100_000_000, "Base salary seems unreasonably high"),
  bonus: z
    .number()
    .min(0, "Bonus cannot be negative")
    .max(100_000_000)
    .optional()
    .default(0),
  stock: z
    .number()
    .min(0, "Stock cannot be negative")
    .max(100_000_000)
    .optional()
    .default(0),
  confidence: z
    .number()
    .min(0)
    .max(1, "Confidence must be between 0 and 1")
    .optional()
    .default(1.0),
});

export const SalaryQuerySchema = z.object({
  company: z.string().optional(),
  role: z.string().optional(),
  level: LevelEnum.optional(),
  location: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export const CompareSchema = z.object({
  salaryId1: z.string().min(1),
  salaryId2: z.string().min(1),
});

export type IngestSalaryInput = z.infer<typeof IngestSalarySchema>;
export type SalaryQuery = z.infer<typeof SalaryQuerySchema>;
