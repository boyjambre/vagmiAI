import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import orchestrationRoutes from "./routes/orchestration.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "VagmiAI Backend",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/orchestration", orchestrationRoutes);

export default app;