import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
    createChannel,
     getChannels,
     getChannelById,
     deleteChannel
 } from "../controllers/channelController.js";

const router = express.Router();

router.post(
"/create",
protect,
createChannel
);

router.get("/", protect, getChannels);
router.get("/:id", protect, getChannelById);
router.delete("/:id", protect, deleteChannel);

export default router;
