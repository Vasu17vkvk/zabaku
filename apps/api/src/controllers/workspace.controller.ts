import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../responses/apiResponse";

import {
    createWorkspaceSchema,
    updateWorkspaceSchema,
    addMemberSchema,
} from "../validation/workspace.validation";

import {
    createWorkspace,
    getUserWorkspaces,
    getWorkspaceById,
    updateWorkspace,
    addMemberToWorkspace,
    removeMemberFromWorkspace,
} from "../services/workspace.service";


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

export const getById = asyncHandler(async (req: Request, res: Response) => {
    const workspace = await getWorkspaceById(
        req.params.workspaceId as string,
        req.user!._id
    );

    return sendSuccess(
        res,
        200,
        "Workspace fetched successfully",
        workspace
    );
});

export const update = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateWorkspaceSchema.parse(req.body);

    const workspace = await updateWorkspace(
        req.params.workspaceId as string,
        req.user!._id.toString(),
        validatedData
    );

    return sendSuccess(
        res,
        200,
        "Workspace updated successfully",
        workspace
    );
});

export const addMember = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = addMemberSchema.parse(req.body);

    const workspace = await addMemberToWorkspace(
        req.params.workspaceId as string,
        req.user!._id.toString(),
        validatedData
    );

    return sendSuccess(
        res,
        200,
        "Member added successfully",
        workspace
    );
});

export const removeMember = asyncHandler(async (req, res) => {
    const workspace = await removeMemberFromWorkspace(
        req.params.workspaceId as string,
        req.user!._id.toString(),
        req.params.memberId as string
    );

    return sendSuccess(
        res,
        200,
        "Member removed successfully",
        workspace
    );
});