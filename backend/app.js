import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import channelRoutes from "./routes/channelRoutes.js";
import youtubeRoutes
from "./routes/youtubeRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use("/api/auth", authRoutes);

import videoRoutes from "./routes/videoRoutes.js";

app.use("/api/videos", videoRoutes);
app.use("/api/channels", channelRoutes);
app.use(
  "/api/youtube",
  youtubeRoutes
);

export default app;