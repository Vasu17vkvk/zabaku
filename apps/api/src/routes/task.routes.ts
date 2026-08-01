import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";

import { create, remove } from "../controllers/task.controller";

import { getAll } from "../controllers/task.controller";

import { update } from "../controllers/task.controller";

import { updateStatus } from "../controllers/task.controller";

import commentRoutes from "./comment.routes";

const router = Router({
    mergeParams: true,
});

router.post("/", authenticate, create);

router.get("/", authenticate, getAll);

router.patch("/:taskId", authenticate, update);

router.patch(
    "/:taskId/status",
    authenticate,
    updateStatus
);

router.delete(
    "/:taskId",
    authenticate,
    remove
);

router.use(
    "/:taskId/comments",
    commentRoutes
);

export default router;