import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";

import {
    create,
    getAll,
    getById,
    update,
} from "../controllers/workspace.controller";

const router = Router();

router.post("/", authenticate, create);

router.get("/", authenticate, getAll);

router.get(
    "/:workspaceId",
    authenticate,
    getById
);

router.patch(
    "/:workspaceId",
    authenticate,
    update
);

export default router;
