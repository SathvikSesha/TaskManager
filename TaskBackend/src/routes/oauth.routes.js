import express from "express";
import { loginWithProvider } from "../controllers/oauth.controller.js";

const router = express.Router();

router.post("/login", loginWithProvider);

export default router;
