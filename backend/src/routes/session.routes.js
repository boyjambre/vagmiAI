import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  createSession,
  getSessionById,
  getSessionResults,
  getSessionHistory,
} from "../controllers/session.controller.js";

const router = Router();

router.use(requireAuth);

// POST /api/sessions/create  — generate questions + save session to MongoDB
router.post("/create", createSession);

// GET /api/sessions/history  — list user's past sessions (must be before :sessionId)
router.get("/history", getSessionHistory);

// GET /api/sessions/:sessionId  — get session with questions (SessionLive reload)
router.get("/:sessionId", getSessionById);

// GET /api/sessions/:sessionId/results  — full results for SessionResult page
router.get("/:sessionId/results", getSessionResults);

export default router;
