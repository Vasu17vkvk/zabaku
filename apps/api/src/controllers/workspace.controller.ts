import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../responses/apiResponse";

import { createWorkspaceSchema } from "../validation/workspace.validation";
import { createWorkspace } from "../services/workspace.service";

import { getUserWorkspaces } from "../services/workspace.service";

export const create = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createWorkspaceSchema.parse(req.body);

    const workspace = await createWorkspace(
        validatedData,
        req.user!
    );

    return sendSuccess(
        res,
        201,
        "Workspace created successfully",
        workspace
    );
});

export const getAll = asyncHandler(async (req: Request, res: Response) => {
    const workspaces = await getUserWorkspaces(req.user!._id);

    return sendSuccess(
        res,
        200,
        "Workspaces fetched successfully",
        workspaces
    );
});
