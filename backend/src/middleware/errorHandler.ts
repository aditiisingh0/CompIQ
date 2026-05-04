import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  if (res.headersSent) return next(err);

  return res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  });
}

export function notFound(req: Request, res: Response) {
  return res.status(404).json({
    error: "Not found",
    path: req.path,
  });
}
