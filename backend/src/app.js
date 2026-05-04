import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import orchestrationRoutes from "./routes/orchestration.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import questionGenerationRoutes from "./routes/questionGeneration.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import answerProcessingRoutes from "./routes/answerProcessing.routes.js";

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
app.use("/api/profile", profileRoutes);
app.use("/api/questions", questionGenerationRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/answers", answerProcessingRoutes);

// Serve CV uploads statically
const uploadDir = process.env.UPLOAD_PATH || path.resolve(process.cwd(), "../shared_data/cv");
app.use("/uploads/cv", express.static(uploadDir));

export default app;