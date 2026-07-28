import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";

import { create } from "../controllers/task.controller";

const router = Router({
    mergeParams: true,
});

router.post("/", authenticate, create);



export default router;