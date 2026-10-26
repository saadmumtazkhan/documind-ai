
import { Router } from "express";
import { pool } from "../config/database";

export const healthRouter = Router();

healthRouter.get("/", async (_req, res, next) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});
