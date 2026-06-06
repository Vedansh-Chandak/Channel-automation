import express from "express";

import {
  connectYoutube,
  youtubeCallback
} from "../controllers/youtubeController.js";

const router = express.Router();

router.get(
  "/connect",
  connectYoutube
);

router.get(
  "/callback",
  youtubeCallback
);

export default router;