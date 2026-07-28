import { Router } from "express";

import {
    register,
    login,
    getProfile,
} from "../controllers/auth.controller";

import { authenticate } from "../middleware/auth.middleware";

console.log("✅ auth.routes.ts loaded");

const router = Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Protected profile route
router.get("/me", authenticate, getProfile);

// Health check (optional)
router.get("/ping", (req, res) => {
    res.json({
        message: "Auth router works!",
    });
});

export default router;