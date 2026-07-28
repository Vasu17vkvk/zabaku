import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";

import {
    create,
    getAll,
    getById,
    update,
    addMember,
    removeMember,
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

router.post(
    "/:workspaceId/members",
    authenticate,
    addMember
);

router.delete(
    "/:workspaceId/members/:memberId",
    authenticate,
    removeMember
);

export default router;
