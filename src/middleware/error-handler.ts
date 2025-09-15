import type { NextFunction, Request, Response } from "express";
import { ResponseError } from "../lib/error";
import { ZodError } from "zod";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  if (err instanceof ResponseError) {
    res.status(err.status).json({
      message: err.message
    });
  } else if (err instanceof ZodError) {
    res.status(422).json({
      message: "Valdiation Error",
      errors: err.issues.map(e => ({
        field: e.path[0],
        message: e.message,
      }))
    });
  } else {
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}