import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
register,
login
} from "../controllers/authController.js";

const router = express.Router();

router.get("/test", (req, res) => {
res.json({
success: true,
message: "Auth Routes Working"
});
});
router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

router.post("/register", register);
router.post("/login", login);

export default router;
