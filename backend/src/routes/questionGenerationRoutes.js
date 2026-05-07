import { Router } from "express";
import { generateQuestionsController } from "../controllers/questionGenerationController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();

// Protect all routes with auth middleware
router.use(requireAuth);

router.post("/generate", generateQuestionsController);

export default router;
