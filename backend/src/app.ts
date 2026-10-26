
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { healthRouter } from "./routes/health";
import { errorHandler } from "./middleware/error-handler";
import { authRouter } from "./routes/auth";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/v1/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/v1/health/database", healthRouter);
app.use("/api/v1/auth", authRouter);

app.use(errorHandler);
