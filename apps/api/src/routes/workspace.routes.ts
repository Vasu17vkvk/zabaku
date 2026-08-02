import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";

import {
    create,
    getAll,
    getById,
    getMembers,
    update,
    addMember,
    updateMember,
    removeMember,
} from "../controllers/workspace.controller";

import projectRoutes from "./project.routes";

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

router.get(
    "/:workspaceId/members",
    authenticate,
    getMembers
);

router.post(
    "/:workspaceId/members",
    authenticate,
    addMember
);

router.patch(
    "/:workspaceId/members/:memberId",
    authenticate,
    updateMember
);

router.delete(
    "/:workspaceId/members/:memberId",
    authenticate,
    removeMember
);


router.use(
    "/:workspaceId/projects",
    projectRoutes
);

export default router;
