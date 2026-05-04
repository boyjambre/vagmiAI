import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { uploadAnswerVideo } from "../middlewares/upload.middleware.js";
import {
  submitAnswer,
  getAnswerById,
} from "../controllers/answerProcessing.controller.js";

const router = Router();

router.use(requireAuth);

// POST /api/answers/submit  — upload video + enqueue Agenda job
router.post("/submit", uploadAnswerVideo.single("video"), submitAnswer);

// GET /api/answers/:answerId  — poll answer processing status
router.get("/:answerId", getAnswerById);

export default router;
