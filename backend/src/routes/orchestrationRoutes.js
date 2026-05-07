import { Router } from "express";
import {
  checkAiHealth,
  processAsrJob,
  processFemJob,
} from "../controllers/orchestrationController.js";

const router = Router();

router.get("/ai-health", checkAiHealth);
router.post("/asr", processAsrJob);
router.post("/fem", processFemJob);

export default router;