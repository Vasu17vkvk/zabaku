import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";

import { sendSuccess } from "../responses/apiResponse";

import { createTaskSchema } from "../validation/task.validation";

import { createTask } from "../services/task.service";

export const create = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createTaskSchema.parse(req.body);

    const task = await createTask(
        req.params.projectId as string,
        req.user!._id.toString(),
        validatedData
    );

    return sendSuccess(
        res,
        201,
        "Task created successfully",
        task
    );
});