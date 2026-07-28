import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getById } from "../controllers/project.controller";
import taskRoutes from "./task.routes";

const router = Router();

router.get("/:projectId", authenticate, getById);

router.use("/:projectId/tasks", taskRoutes);


export default router;