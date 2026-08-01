import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../responses/apiResponse";

import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
} from "../services/notification.service";

export const getAll = asyncHandler(
    async (req: Request, res: Response) => {
        const notifications = await getNotifications(
            req.user!._id.toString()
        );

        return sendSuccess(
            res,
            200,
            "Notifications fetched successfully",
            notifications
        );
    }
);

export const read = asyncHandler(
    async (req: Request, res: Response) => {
        const notification = await markAsRead(
            req.params.notificationId as string,
            req.user!._id.toString()
        );

        return sendSuccess(
            res,
            200,
            "Notification marked as read",
            notification
        );
    }
);

export const readAll = asyncHandler(
    async (req: Request, res: Response) => {
        await markAllAsRead(req.user!._id.toString());

        return sendSuccess(
            res,
            200,
            "All notifications marked as read"
        );
    }
);

export const unreadCount = asyncHandler(
    async (req: Request, res: Response) => {
        const count = await getUnreadCount(
            req.user!._id.toString()
        );

        return sendSuccess(
            res,
            200,
            "Unread count fetched successfully",
            { count }
        );
    }
);