import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";
import { getTaskTimeline } from "../controllers/activity.controller";

const router = Router({
    mergeParams: true,
});

router.get(
    "/",
    authenticate,
    getTaskTimeline
);

export default router;