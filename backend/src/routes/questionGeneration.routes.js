import { Router } from "express";
import { generateQuestionsController } from "../controllers/questionGeneration.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// Protect all routes with auth middleware
router.use(requireAuth);

router.post("/generate", generateQuestionsController);

export default router;
