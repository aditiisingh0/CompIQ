# CompIQ — Compensation Intelligence System

> Level-structured salary data for India's tech ecosystem and beyond.

Built as a production-grade alternative to AmbitionBox/Glassdoor — using **standardized levels** (L3→L8), full TC breakdown (base + bonus + stock), and real comparability.

---

## Architecture

```
compiq/
├── backend/          # Express + TypeScript + Prisma + PostgreSQL
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── index.ts
│       ├── routes/
│       │   ├── ingest.ts      # POST /ingest-salary
│       │   ├── salaries.ts    # GET /salaries
│       │   ├── company.ts     # GET /company/:company
│       │   └── compare.ts     # GET /compare
│       └── lib/
│           ├── prisma.ts
│           ├── normalize.ts
│           └── schemas.ts
└── frontend/         # Next.js 14 + Tailwind
    └── src/
        ├── app/
        │   ├── page.tsx           # Homepage
        │   ├── salaries/page.tsx  # Salary table
        │   ├── company/[slug]/    # Company page
        │   └── compare/page.tsx   # Compare page
        ├── components/
        └── lib/api.ts
```

---

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL running locally (or Supabase / Railway / Neon)
- pnpm or npm

---

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set DATABASE_URL to your PostgreSQL connection string

npm install
npx prisma generate
npx prisma db push        # creates tables
npm run db:seed           # seeds 40+ salary records
npm run dev               # starts on http://localhost:4000
```

**Verify:**
```bash
curl http://localhost:4000/health
curl http://localhost:4000/salaries
```

---

### 2. Frontend

```bash
cd frontend
cp .env.local.example .env.local
# Edit .env.local if your backend runs on a different port

npm install
npm run dev               # starts on http://localhost:3000
```

---

## API Reference

### `POST /ingest-salary`
Ingest a new salary record (validates, normalizes, deduplicates).

**Body:**
```json
{
  "company": "Google",
  "role": "Software Engineer",
  "level": "L5",
  "location": "Bangalore",
  "experience_years": 6,
  "base_salary": 4500000,
  "bonus": 800000,
  "stock": 2500000,
  "confidence": 0.95
}
```

**Levels accepted:** `L3 | L4 | L5 | L6 | L7 | L8`

**Responses:**
- `201` — Created
- `400` — Validation error (with field details)
- `409` — Duplicate entry

---

### `GET /salaries`
Filtered, sorted, paginated salary list.

**Query params:**
| Param | Type | Example |
|-------|------|---------|
| `company` | string | `google` |
| `role` | string | `engineer` |
| `level` | L3–L8 | `L5` |
| `location` | string | `bangalore` |
| `sort` | `asc\|desc` | `desc` |
| `page` | number | `1` |
| `limit` | number | `20` |

---

### `GET /company/:company`
Company overview with median TC and level distribution.

**Example:** `GET /company/google`

**Response:**
```json
{
  "company": "Google",
  "median_total_compensation": 4800000,
  "level_distribution": [
    { "level": "L3", "count": 1 },
    { "level": "L4", "count": 2 }
  ],
  "count": 6,
  "salaries": [...]
}
```

---

### `GET /compare?salaryId1=X&salaryId2=Y`
Side-by-side comparison of two salary records.

**Response:**
```json
{
  "salary1": { ... },
  "salary2": { ... },
  "diff": {
    "base_salary": 1300000,
    "bonus": 500000,
    "stock": 1300000,
    "total_compensation": 3100000,
    "level_difference": 1
  }
}
```

---

## Design Decisions

### Why PostgreSQL + Prisma?
- Type-safe queries
- Easy migrations
- `cuid()` IDs are URL-safe

### Why levels matter
- L5 at Google ≠ L5 at Infosys in pay, but they ARE comparable within tiers
- Title-based data (Glassdoor/AmbitionBox) is unstructured and misleading
- This system rejects submissions without a standardized level

### Normalization
- Company names: `"Google"`, `"GOOGLE"`, `"google "` → `"google"` (stored), `"Google"` (displayed)
- Deduplication: rejects identical company+role+level+location+base combos

### What we deliberately skipped
- Auth (out of scope for v1)
- Reviews / unstructured data
- AI features on the frontend
- Over-engineered caching

---

## Deployment

### Backend → Railway / Render / Fly.io
```bash
# Set env vars: DATABASE_URL, PORT, FRONTEND_URL, NODE_ENV=production
npm run build
npm start
```

### Frontend → Vercel
```bash
# Set env var: NEXT_PUBLIC_API_URL=https://your-backend.railway.app
vercel deploy
```

### Database → Supabase / Neon / Railway
- Get your PostgreSQL connection string
- Set as `DATABASE_URL` in backend env

---

## Feature Map (Research)

| Feature | Levels.fyi | 6figr | AmbitionBox | Glassdoor | CompIQ |
|---------|-----------|-------|-------------|-----------|--------|
| Standardized levels | ✅ | ⚠️ partial | ❌ | ❌ | ✅ |
| Base + Bonus + Stock breakdown | ✅ | ✅ | ❌ | ❌ | ✅ |
| Server-side filtering | ✅ | ✅ | ⚠️ | ✅ | ✅ |
| Company page with median | ✅ | ⚠️ | ✅ | ✅ | ✅ |
| Side-by-side comparison | ✅ | ❌ | ❌ | ❌ | ✅ |
| India-first data | ❌ | ✅ | ✅ | ⚠️ | ✅ |
| Deduplication | ✅ | ? | ❌ | ❌ | ✅ |
| Open ingest API | ❌ | ❌ | ❌ | ❌ | ✅ |
| Auth | ✅ | ✅ | ✅ | ✅ | ❌ (v2) |
| Reviews | ❌ | ❌ | ✅ | ✅ | ❌ |
