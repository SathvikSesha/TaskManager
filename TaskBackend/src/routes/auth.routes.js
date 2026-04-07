import express from "express";
import {
  signup,
  login,
  getGoogleAuthUrl,
  googleAuthCallback,
} from "../controllers/auth.controller.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.get("/google/url", getGoogleAuthUrl);
router.get("/google/callback", googleAuthCallback);

export default router;
