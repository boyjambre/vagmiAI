import { Router } from "express";
import { getMyProfile, updateMyProfile } from "../controllers/profile.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { uploadCV } from "../middlewares/upload.middleware.js";

const router = Router();

// Protect all user routes with auth middleware
router.use(requireAuth);

router.get("/", getMyProfile);
router.put("/", uploadCV.single("cv"), updateMyProfile);

export default router;
