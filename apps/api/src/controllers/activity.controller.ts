import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../responses/apiResponse";

import { getTaskActivity } from "../services/activity.service";

export const getTaskTimeline = asyncHandler(
    async (req: Request, res: Response) => {
        const activities = await getTaskActivity(
            req.params.taskId as string
        );

        return sendSuccess(
            res,
            200,
            "Activity fetched successfully",
            activities
        );
    }
);