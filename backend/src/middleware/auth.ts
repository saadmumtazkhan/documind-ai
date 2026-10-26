import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../config/database";
import { env } from "../config/env";

export const requireAuth: RequestHandler = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    const [scheme, token] = authorization?.split(" ") ?? [];

    if (scheme !== "Bearer" || !token) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (typeof decoded === "string" || !decoded.sub) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    const result = await pool.query(
      `SELECT id, email, role FROM users WHERE id = $1`,
      [decoded.sub],
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: "User no longer exists" });
      return;
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    next(error);
  }
};
