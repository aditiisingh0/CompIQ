# 🚀 CompIQ — Salary Intelligence Platform

> A full-stack compensation intelligence system for structured, comparable salary insights.

CompIQ is designed as a modern alternative to platforms like Glassdoor and AmbitionBox — focusing on **level-based standardization (L3–L8)**, full compensation breakdown, and real comparability.

---

## ✨ Features

- 🔍 Browse and filter salary data (company, role, level, location)
- ⚖️ Compare two salary offers side-by-side
- ➕ Submit new salary entries (stored in database)
- 📊 Company-level insights (median compensation + distribution)
- 📄 Clean UI with responsive design

---

## 🧠 Tech Stack

**Frontend**
- Next.js 14
- Tailwind CSS

**Backend**
- Express.js (TypeScript)
- Prisma ORM

**Database**
- PostgreSQL

---

## 🏗️ Project Structure


compiq/
├── backend/
├── frontend/


---

## ⚙️ Setup Instructions

### 1. Backend

```bash
cd backend
cp .env.example .env

Update .env:

DATABASE_URL="postgresql://localhost:5432/compiq"
PORT=4000

Then run:

npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
2. Frontend
cd frontend

Create .env.local:

NEXT_PUBLIC_API_URL=http://localhost:4000

Run:

npm install
npm run dev
🔗 API Endpoints
GET /salaries
POST /ingest-salary
GET /compare
GET /company/:company
📌 Current Status
✅ Fully functional locally
❌ Not deployed yet
👤 Author

Aditi Singh
GitHub: https://github.com/aditiisingh0/CompIQ