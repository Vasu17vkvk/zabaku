import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";

import {
    create,
    getAll,
} from "../controllers/workspace.controller";

const router = Router();

router.post("/", authenticate, create);

router.get("/", authenticate, getAll);

export default router;
