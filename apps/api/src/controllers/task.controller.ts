import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";

import { sendSuccess } from "../responses/apiResponse";

import { createTaskSchema } from "../validation/task.validation";

import { createTask } from "../services/task.service";

import { getTasks } from "../services/task.service";

import { updateTask } from "../services/task.service";
import { updateTaskSchema } from "../validation/task.validation";

import { updateTaskStatus } from "../services/task.service";
import { updateTaskStatusSchema } from "../validation/task.validation";

import { deleteTask } from "../services/task.service";

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

export const getAll = asyncHandler(
    async (req: Request, res: Response) => {
        const tasks = await getTasks(
            req.params.projectId as string,
            req.user!._id.toString()
        );

        return sendSuccess(
            res,
            200,
            "Tasks fetched successfully",
            tasks
        );
    }
);

export const update = asyncHandler(
    async (req: Request, res: Response) => {
        const validatedData = updateTaskSchema.parse(req.body);

        const task = await updateTask(
            req.params.taskId as string,
            req.user!._id.toString(),
            validatedData
        );

        return sendSuccess(
            res,
            200,
            "Task updated successfully",
            task
        );
    }
);

export const updateStatus = asyncHandler(
    async (req: Request, res: Response) => {
        const validatedData =
            updateTaskStatusSchema.parse(req.body);

        const task = await updateTaskStatus(
            req.params.taskId as string,
            req.user!._id.toString(),
            validatedData
        );

        return sendSuccess(
            res,
            200,
            "Task status updated successfully",
            task
        );
    }
);

export const remove = asyncHandler(
    async (req: Request, res: Response) => {
        await deleteTask(
            req.params.taskId as string,
            req.user!._id.toString()
        );

        return sendSuccess(
            res,
            200,
            "Task deleted successfully"
        );
    }
);