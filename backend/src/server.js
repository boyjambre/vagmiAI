import mongoose from "mongoose";
import app from "./app.js";
import { env } from "./config/env.js";
import { getAgenda, startAgenda, stopAgenda } from "./services/agenda.service.js";
import { defineProcessAnswerJob } from "./jobs/processAnswer.job.js";

async function start() {
  // ── MongoDB ───────────────────────────────────────────────────────────────
  try {
    await mongoose.connect(env.mongoUri);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }

  // ── Agenda ────────────────────────────────────────────────────────────────
  try {
    getAgenda(); 
    defineProcessAnswerJob(); 
    await startAgenda();
  } catch (err) {
    console.error("Agenda startup failed:", err.message);
  }

  // ── HTTP server ───────────────────────────────────────────────────────────
  const server = app.listen(env.port, () => {
    console.log(`Backend running on port ${env.port}`);
  });

  // ── Graceful shutdown ─────────────────────────────────────────────────────
  async function shutdown(signal) {
    console.log(`\nReceived ${signal}. Shutting down…`);
    await stopAgenda();
    server.close(() => {
      mongoose.connection.close().then(() => process.exit(0));
    });
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

start();