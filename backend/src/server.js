import mongoose from "mongoose";
import app from "./app.js";
import { env } from "./config/env.js";

async function start() {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }

  app.listen(env.port, () => {
    console.log(`Backend running on port ${env.port}`);
  });
}

start();