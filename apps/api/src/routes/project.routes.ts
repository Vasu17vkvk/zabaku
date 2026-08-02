import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";

import { create, getAll } from "../controllers/project.controller";

import taskRoutes from "./task.routes";

const router = Router({ mergeParams: true });

router.post("/", authenticate, create);
router.get("/", authenticate, getAll);

router.use(
    "/:projectId/tasks",
    taskRoutes
);


export default router;