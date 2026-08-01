import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";

import {
    create,
    getAll,
    update,
    remove,
} from "../controllers/comment.controller";

const router = Router({
    mergeParams: true,
});

router.post("/", authenticate, create);

router.get("/", authenticate, getAll);

router.patch("/:commentId", authenticate, update);

router.delete("/:commentId", authenticate, remove);

export default router;