import express from "express";
import cors from "cors";
import ingestRouter from "./routes/ingest";
import salariesRouter from "./routes/salaries";
import companyRouter from "./routes/company";
import compareRouter from "./routes/compare";
import { errorHandler, notFound } from "./middleware/errorHandler";

const app = express();
const PORT = parseInt(process.env.PORT || "4000", 10);

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Health check
app.get("/health", (_, res) =>
  res.json({ status: "ok", timestamp: new Date() })
);

// Routes
app.post("/ingest-salary", ingestRouter);
app.use("/salaries", salariesRouter);
app.use("/company", companyRouter);
app.use("/compare", compareRouter);

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

// 👇 KEY FIX: bind to 0.0.0.0 so Render can detect the port
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

export default app;