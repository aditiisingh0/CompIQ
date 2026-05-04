import { PrismaClient, Level } from "@prisma/client";

const prisma = new PrismaClient();

const seedData = [
  // Google
  { company: "google", role: "software engineer", level: Level.L3, location: "bangalore", experience_years: 1, base_salary: 2200000, bonus: 300000, stock: 500000 },
  { company: "google", role: "software engineer", level: Level.L4, location: "bangalore", experience_years: 3, base_salary: 3200000, bonus: 500000, stock: 1200000 },
  { company: "google", role: "software engineer", level: Level.L5, location: "bangalore", experience_years: 6, base_salary: 4500000, bonus: 800000, stock: 2500000 },
  { company: "google", role: "software engineer", level: Level.L6, location: "bangalore", experience_years: 10, base_salary: 6000000, bonus: 1200000, stock: 5000000 },
  { company: "google", role: "product manager", level: Level.L5, location: "bangalore", experience_years: 5, base_salary: 5000000, bonus: 900000, stock: 2800000 },
  { company: "google", role: "software engineer", level: Level.L4, location: "hyderabad", experience_years: 4, base_salary: 3000000, bonus: 450000, stock: 1100000 },

  // Microsoft
  { company: "microsoft", role: "software engineer", level: Level.L3, location: "hyderabad", experience_years: 1, base_salary: 1800000, bonus: 250000, stock: 400000 },
  { company: "microsoft", role: "software engineer", level: Level.L4, location: "hyderabad", experience_years: 3, base_salary: 2800000, bonus: 400000, stock: 1000000 },
  { company: "microsoft", role: "software engineer", level: Level.L5, location: "hyderabad", experience_years: 7, base_salary: 4000000, bonus: 700000, stock: 2200000 },
  { company: "microsoft", role: "data scientist", level: Level.L4, location: "bangalore", experience_years: 3, base_salary: 2600000, bonus: 380000, stock: 900000 },
  { company: "microsoft", role: "software engineer", level: Level.L6, location: "hyderabad", experience_years: 11, base_salary: 5500000, bonus: 1100000, stock: 4500000 },

  // Amazon
  { company: "amazon", role: "software development engineer", level: Level.L4, location: "bangalore", experience_years: 2, base_salary: 2400000, bonus: 350000, stock: 800000 },
  { company: "amazon", role: "software development engineer", level: Level.L5, location: "bangalore", experience_years: 5, base_salary: 3800000, bonus: 600000, stock: 2000000 },
  { company: "amazon", role: "software development engineer", level: Level.L6, location: "bangalore", experience_years: 9, base_salary: 5200000, bonus: 1000000, stock: 4000000 },
  { company: "amazon", role: "product manager", level: Level.L5, location: "hyderabad", experience_years: 5, base_salary: 4200000, bonus: 700000, stock: 2300000 },

  // Meta
  { company: "meta", role: "software engineer", level: Level.L4, location: "bangalore", experience_years: 2, base_salary: 3500000, bonus: 600000, stock: 1500000 },
  { company: "meta", role: "software engineer", level: Level.L5, location: "bangalore", experience_years: 6, base_salary: 5200000, bonus: 1000000, stock: 3500000 },
  { company: "meta", role: "software engineer", level: Level.L6, location: "bangalore", experience_years: 10, base_salary: 7000000, bonus: 1500000, stock: 6000000 },

  // Flipkart
  { company: "flipkart", role: "software development engineer", level: Level.L3, location: "bangalore", experience_years: 1, base_salary: 1600000, bonus: 150000, stock: 200000 },
  { company: "flipkart", role: "software development engineer", level: Level.L4, location: "bangalore", experience_years: 3, base_salary: 2400000, bonus: 300000, stock: 500000 },
  { company: "flipkart", role: "software development engineer", level: Level.L5, location: "bangalore", experience_years: 6, base_salary: 3500000, bonus: 500000, stock: 1200000 },
  { company: "flipkart", role: "engineering manager", level: Level.L5, location: "bangalore", experience_years: 8, base_salary: 4000000, bonus: 600000, stock: 1500000 },

  // Swiggy
  { company: "swiggy", role: "software engineer", level: Level.L4, location: "bangalore", experience_years: 3, base_salary: 2200000, bonus: 280000, stock: 600000 },
  { company: "swiggy", role: "software engineer", level: Level.L5, location: "bangalore", experience_years: 6, base_salary: 3200000, bonus: 450000, stock: 1100000 },
  { company: "swiggy", role: "data scientist", level: Level.L4, location: "bangalore", experience_years: 3, base_salary: 2100000, bonus: 260000, stock: 550000 },

  // Razorpay
  { company: "razorpay", role: "software engineer", level: Level.L4, location: "bangalore", experience_years: 3, base_salary: 2500000, bonus: 350000, stock: 800000 },
  { company: "razorpay", role: "software engineer", level: Level.L5, location: "bangalore", experience_years: 6, base_salary: 3600000, bonus: 550000, stock: 1400000 },
  { company: "razorpay", role: "product manager", level: Level.L4, location: "bangalore", experience_years: 4, base_salary: 2800000, bonus: 400000, stock: 900000 },

  // Zepto
  { company: "zepto", role: "software engineer", level: Level.L4, location: "mumbai", experience_years: 3, base_salary: 2600000, bonus: 400000, stock: 1000000 },
  { company: "zepto", role: "software engineer", level: Level.L5, location: "mumbai", experience_years: 6, base_salary: 3800000, bonus: 600000, stock: 1800000 },

  // Infosys
  { company: "infosys", role: "software engineer", level: Level.L3, location: "bangalore", experience_years: 1, base_salary: 650000, bonus: 50000, stock: 0 },
  { company: "infosys", role: "software engineer", level: Level.L4, location: "bangalore", experience_years: 4, base_salary: 1000000, bonus: 80000, stock: 0 },
  { company: "infosys", role: "senior software engineer", level: Level.L5, location: "hyderabad", experience_years: 7, base_salary: 1500000, bonus: 120000, stock: 0 },

  // TCS
  { company: "tcs", role: "software engineer", level: Level.L3, location: "mumbai", experience_years: 1, base_salary: 600000, bonus: 40000, stock: 0 },
  { company: "tcs", role: "software engineer", level: Level.L4, location: "bangalore", experience_years: 4, base_salary: 950000, bonus: 70000, stock: 0 },

  // Atlassian
  { company: "atlassian", role: "software engineer", level: Level.L4, location: "bangalore", experience_years: 3, base_salary: 2900000, bonus: 420000, stock: 1100000 },
  { company: "atlassian", role: "software engineer", level: Level.L5, location: "bangalore", experience_years: 7, base_salary: 4100000, bonus: 700000, stock: 2200000 },

  // Apple
  { company: "apple", role: "software engineer", level: Level.L4, location: "hyderabad", experience_years: 3, base_salary: 3100000, bonus: 480000, stock: 1300000 },
  { company: "apple", role: "software engineer", level: Level.L5, location: "hyderabad", experience_years: 7, base_salary: 4600000, bonus: 850000, stock: 2800000 },
];

async function main() {
  console.log("🌱 Seeding database...");
  await prisma.salary.deleteMany(); // clean slate for seeding

  let inserted = 0;
  for (const entry of seedData) {
    const total_compensation = entry.base_salary + entry.bonus + entry.stock;
    await prisma.salary.create({
      data: { ...entry, total_compensation, confidence_score: 0.9 },
    });
    inserted++;
  }

  console.log(`✅ Seeded ${inserted} salary records`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
