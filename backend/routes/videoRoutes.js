import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  createVideo,
  getVideos,
  generateVideoScript,
  generateVoiceOver,
  renderVideoFile,
  testPexels,
  generateVideoSEO,
  uploadToYoutube,
  autoGenerateVideo
} from "../controllers/videoController.js";

const router = express.Router();

router.post("/create", protect, createVideo);

router.get("/", protect, getVideos);

router.post(
  "/generate-script/:id",
  protect,
  generateVideoScript
);

router.post(
  "/generate-seo/:id",
  protect,
  generateVideoSEO
);

router.post(
  "/generate-voice/:id",
  protect,
  generateVoiceOver
);

router.post(
  "/render/:id",
  protect,
  renderVideoFile
);

router.get(
  "/test-pexels",
  protect,
  testPexels
);

router.post(
  "/upload/:id",
  protect,
  uploadToYoutube
);

router.post(
  "/auto/:id",
  protect,
  autoGenerateVideo
);
export default router;