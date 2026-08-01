import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware";

import {
    getAll,
    read,
    readAll,
    unreadCount,
} from "../controllers/notification.controller";

const router = Router();

router.use(authenticate);

router.get("/", getAll);

router.get("/unread-count", unreadCount);

router.patch("/read-all", readAll);

router.patch("/:notificationId/read", read);

export default router;